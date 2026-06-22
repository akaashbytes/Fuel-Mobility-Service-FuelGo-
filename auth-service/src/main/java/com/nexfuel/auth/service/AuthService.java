package com.nexfuel.auth.service;

import com.nexfuel.auth.config.JwtProperties;
import com.nexfuel.auth.config.JwtTokenProvider;
import com.nexfuel.auth.entity.PermissionEntity;
import com.nexfuel.auth.entity.RefreshTokenEntity;
import com.nexfuel.auth.entity.RoleEntity;
import com.nexfuel.auth.entity.UserEntity;
import com.nexfuel.auth.repository.RefreshTokenRepository;
import com.nexfuel.auth.repository.RoleRepository;
import com.nexfuel.auth.repository.UserRepository;
import com.nexfuel.auth.dto.*;
import com.nexfuel.shared.dto.UserSummaryDto;
import com.nexfuel.shared.enums.OtpType;
import com.nexfuel.shared.enums.UserStatus;
import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;
    private final OtpService otpService;

    @Transactional
    public UserSummaryDto register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BaseException(ErrorCode.USER_ALREADY_EXISTS);
        }

        if (request.getPhoneNumber() != null && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BaseException(ErrorCode.BAD_REQUEST, "Phone number is already registered");
        }

        // Map role name (e.g. CUSTOMER -> ROLE_CUSTOMER)
        String roleName = request.getRole().startsWith("ROLE_") ? request.getRole() : "ROLE_" + request.getRole().toUpperCase();
        RoleEntity role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new BaseException(ErrorCode.BAD_REQUEST, "Role not found: " + roleName));

        UserEntity user = new UserEntity();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.INACTIVE); // Inactive until OTP verification
        user.setRoles(Set.of(role));

        UserEntity savedUser = userRepository.save(user);

        // Generate email verification OTP
        otpService.generateOtp(savedUser, OtpType.EMAIL_SIGNUP);

        return mapToSummaryDto(savedUser);
    }

    @Transactional
    public void verifyRegistrationOtp(VerifyOtpRequest request) {
        // Verify OTP code
        otpService.verifyOtp(request.getEmail(), request.getOtpCode(), request.getVerifyType());

        // Activate user
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));
        
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BaseException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BaseException(ErrorCode.INVALID_CREDENTIALS);
        }

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new BaseException(ErrorCode.ACCOUNT_INACTIVE);
        }

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new BaseException(ErrorCode.ACCOUNT_SUSPENDED);
        }

        // Generate Tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        RefreshTokenEntity refreshToken = generateAndSaveRefreshToken(user);

        UserSummaryDto userSummary = mapToSummaryDto(user);

        return new AuthResponse(
                accessToken,
                "Bearer",
                jwtProperties.getAccessTokenExpirationMs() / 1000,
                userSummary,
                refreshToken.getToken()
        );
    }

    @Transactional
    public AuthResponse refresh(String tokenValue) {
        RefreshTokenEntity oldToken = refreshTokenRepository.findByTokenAndRevokedFalse(tokenValue)
                .orElseThrow(() -> new BaseException(ErrorCode.INVALID_REFRESH_TOKEN));

        if (oldToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            oldToken.setRevoked(true);
            refreshTokenRepository.save(oldToken);
            throw new BaseException(ErrorCode.INVALID_REFRESH_TOKEN, "Refresh token has expired");
        }

        UserEntity user = oldToken.getUser();

        // Refresh Token Rotation (RTR): Revoke old token and issue a new one
        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        RefreshTokenEntity newRefreshToken = generateAndSaveRefreshToken(user);

        UserSummaryDto userSummary = mapToSummaryDto(user);

        return new AuthResponse(
                newAccessToken,
                "Bearer",
                jwtProperties.getAccessTokenExpirationMs() / 1000,
                userSummary,
                newRefreshToken.getToken()
        );
    }

    @Transactional
    public void logout(String tokenValue) {
        RefreshTokenEntity token = refreshTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new BaseException(ErrorCode.INVALID_REFRESH_TOKEN));
        token.setRevoked(true);
        refreshTokenRepository.save(token);
    }

    public UserProfileResponse getProfile(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));
        
        Set<String> roles = user.getRoles().stream()
                .map(RoleEntity::getName)
                .collect(Collectors.toSet());

        Set<String> permissions = user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(PermissionEntity::getName)
                .collect(Collectors.toSet());

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getStatus().name(),
                roles,
                permissions
        );
    }

    private RefreshTokenEntity generateAndSaveRefreshToken(UserEntity user) {
        RefreshTokenEntity token = new RefreshTokenEntity();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(LocalDateTime.now().plusNanos(jwtProperties.getRefreshTokenExpirationMs() * 1_000_000));
        token.setRevoked(false);
        return refreshTokenRepository.save(token);
    }

    private UserSummaryDto mapToSummaryDto(UserEntity user) {
        Set<String> roles = user.getRoles().stream()
                .map(RoleEntity::getName)
                .collect(Collectors.toSet());

        return new UserSummaryDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getStatus().name(),
                roles
        );
    }
}
