package com.nexfuel.auth.controller;

import com.nexfuel.auth.dto.*;
import com.nexfuel.auth.service.AuthService;
import com.nexfuel.shared.constant.SecurityConstants;
import com.nexfuel.shared.dto.UserSummaryDto;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication Center API", description = "Endpoints for signup, sign-in, OTP checking, and token session management")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user profile with PENDING status and generates verification OTP")
    public ResponseEntity<ApiResponse<UserSummaryDto>> register(@Valid @RequestBody RegisterRequest request) {
        UserSummaryDto registeredUser = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully. Check email for verification OTP.", registeredUser));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify user account OTP", description = "Verifies the sign-up OTP code and activates the user profile")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        authService.verifyRegistrationOtp(request);
        return ResponseEntity.ok(ApiResponse.success("Account verified successfully. User is now active."));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user credentials", description = "Verifies credentials, issues JWT access token, and sets refresh token HttpOnly cookie")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        setRefreshTokenCookie(response, authResponse.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Authentication successful.", authResponse));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Rotate refresh token and issue access token", description = "Validates refresh token cookie, rotates it, and issues a new access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        AuthResponse authResponse = authService.refresh(refreshToken);
        setRefreshTokenCookie(response, authResponse.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully.", authResponse));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user and invalidate session", description = "Revokes refresh token in database and clears HttpOnly refresh token cookie")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        authService.logout(refreshToken);
        clearRefreshTokenCookie(response);
        return ResponseEntity.ok(ApiResponse.success("Session terminated successfully."));
    }

    @GetMapping("/profile")
    @Operation(summary = "Retrieve authenticated user profile", description = "Reads user ID from gateway propagated header or JWT context and returns profile info")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@RequestHeader(value = SecurityConstants.HEADER_USER_ID, required = false) Long headerUserId,
                                                                        HttpServletRequest request) {
        // Support direct extraction from header (propagated by gateway) or fallback attribute
        Long userId = headerUserId;
        if (userId == null) {
            Object idAttribute = request.getAttribute(SecurityConstants.HEADER_USER_ID);
            if (idAttribute instanceof String) {
                userId = Long.valueOf((String) idAttribute);
            } else if (idAttribute instanceof Long) {
                userId = (Long) idAttribute;
            }
        }
        
        if (userId == null) {
            throw new com.nexfuel.shared.exception.BaseException(
                    com.nexfuel.shared.exception.ErrorCode.UNAUTHORIZED_ACCESS,
                    "User identity header is missing"
            );
        }

        UserProfileResponse profile = authService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully.", profile));
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // Set to true in production with HTTPS
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 days in seconds
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            throw new com.nexfuel.shared.exception.BaseException(
                    com.nexfuel.shared.exception.ErrorCode.INVALID_REFRESH_TOKEN,
                    "Refresh token cookie is missing"
            );
        }
        return Arrays.stream(request.getCookies())
                .filter(cookie -> "refreshToken".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElseThrow(() -> new com.nexfuel.shared.exception.BaseException(
                        com.nexfuel.shared.exception.ErrorCode.INVALID_REFRESH_TOKEN,
                        "Refresh token is missing"
                ));
    }
}
