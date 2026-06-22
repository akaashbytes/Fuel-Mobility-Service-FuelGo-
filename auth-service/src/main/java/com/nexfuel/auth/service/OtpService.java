package com.nexfuel.auth.service;

import com.nexfuel.auth.entity.OtpVerificationEntity;
import com.nexfuel.auth.entity.UserEntity;
import com.nexfuel.auth.repository.OtpVerificationRepository;
import com.nexfuel.shared.enums.OtpType;
import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpVerificationRepository otpVerificationRepository;
    private final OtpGenerator otpGenerator;
    private final OtpValidator otpValidator;

    @Transactional
    public String generateOtp(UserEntity user, OtpType type) {
        String rawOtpCode = otpGenerator.generate6DigitOtp();
        String hashedOtpCode = otpValidator.hashOtp(rawOtpCode);

        OtpVerificationEntity otp = new OtpVerificationEntity();
        otp.setUser(user);
        otp.setOtpCode(hashedOtpCode); // Store hashed OTP code
        otp.setVerifyType(type);
        otp.setExpiredAt(LocalDateTime.now().plusMinutes(10)); // 10 minutes lifespan
        otp.setAttempts(0);
        otp.setStatus("PENDING");

        otpVerificationRepository.save(otp);

        // Print raw code to logs for development testing
        System.out.println(">>> GENERATED OTP FOR " + user.getEmail() + " [" + type + "]: " + rawOtpCode);

        return rawOtpCode;
    }

    @Transactional
    public void verifyOtp(String email, String rawOtpCode, OtpType type) {
        // Retrieve the most recent pending OTP verification for the email and type
        OtpVerificationEntity otp = otpVerificationRepository
                .findByUserEmailAndVerifyTypeAndStatus(email, type, "PENDING")
                .orElseThrow(() -> new BaseException(ErrorCode.INVALID_OTP, "No pending verification found"));

        try {
            otpValidator.validate(otp, rawOtpCode);
            otp.setStatus("VERIFIED");
        } catch (BaseException ex) {
            // Save state updates (like attempt counts) even on verification failures
            otpVerificationRepository.save(otp);
            throw ex;
        }

        otpVerificationRepository.save(otp);
    }
}
