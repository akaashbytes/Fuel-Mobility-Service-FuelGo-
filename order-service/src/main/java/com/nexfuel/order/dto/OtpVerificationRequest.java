package com.nexfuel.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OtpVerificationRequest {
    @NotBlank(message = "OTP verification code is required")
    private String otpCode;
}
