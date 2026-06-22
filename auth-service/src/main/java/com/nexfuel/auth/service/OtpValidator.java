package com.nexfuel.auth.service;

import com.nexfuel.auth.entity.OtpVerificationEntity;
import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;

@Component
public class OtpValidator {

    public String hashOtp(String otpCode) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(otpCode.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Error hashing OTP code", ex);
        }
    }

    public void validate(OtpVerificationEntity otp, String rawOtpCode) {
        if (otp.getExpiredAt().isBefore(LocalDateTime.now())) {
            otp.setStatus("EXPIRED");
            throw new BaseException(ErrorCode.OTP_EXPIRED);
        }

        if (otp.getAttempts() >= 3) {
            otp.setStatus("EXPIRED");
            throw new BaseException(ErrorCode.OTP_MAX_ATTEMPTS);
        }

        // Increment attempts on verify
        otp.setAttempts(otp.getAttempts() + 1);

        String hashedInput = hashOtp(rawOtpCode);
        if (!otp.getOtpCode().equals(hashedInput)) {
            throw new BaseException(ErrorCode.INVALID_OTP);
        }
    }
}
