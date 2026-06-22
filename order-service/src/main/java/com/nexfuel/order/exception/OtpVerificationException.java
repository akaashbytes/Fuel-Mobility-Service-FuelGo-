package com.nexfuel.order.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class OtpVerificationException extends BaseException {
    
    public OtpVerificationException() {
        super(ErrorCode.INVALID_OTP, "Invalid or expired OTP");
    }

    public OtpVerificationException(String message) {
        super(ErrorCode.INVALID_OTP, message);
    }
}
