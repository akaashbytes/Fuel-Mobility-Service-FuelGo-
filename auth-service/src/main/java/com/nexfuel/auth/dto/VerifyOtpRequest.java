package com.nexfuel.auth.dto;

import com.nexfuel.shared.enums.OtpType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VerifyOtpRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "OTP code is required")
    private String otpCode;

    @NotNull(message = "Verification type is required")
    private OtpType verifyType;
}
