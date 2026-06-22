package com.nexfuel.shared.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    INVALID_CREDENTIALS(401, "Invalid email or password"),
    UNAUTHORIZED_ACCESS(401, "Full authentication is required to access this resource"),
    ACCESS_DENIED(403, "You do not have permission to access this resource"),
    USER_NOT_FOUND(404, "User not found"),
    USER_ALREADY_EXISTS(409, "User email already registered"),
    INVALID_TOKEN(401, "Invalid or expired JWT token"),
    INVALID_REFRESH_TOKEN(401, "Invalid or expired refresh token"),
    INVALID_OTP(400, "Invalid OTP code"),
    OTP_EXPIRED(400, "OTP has expired"),
    OTP_MAX_ATTEMPTS(400, "Maximum OTP verification attempts reached"),
    ACCOUNT_SUSPENDED(403, "Account has been suspended"),
    ACCOUNT_INACTIVE(403, "Account is inactive. Please verify OTP first"),
    BAD_REQUEST(400, "Invalid request body or parameters"),
    INTERNAL_SERVER_ERROR(500, "An unexpected internal server error occurred");

    private final int status;
    private final String message;

    ErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
