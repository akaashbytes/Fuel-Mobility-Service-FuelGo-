package com.nexfuel.auth.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class OtpException extends BaseException {
    
    public OtpException(ErrorCode errorCode) {
        super(errorCode);
    }
    
    public OtpException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
