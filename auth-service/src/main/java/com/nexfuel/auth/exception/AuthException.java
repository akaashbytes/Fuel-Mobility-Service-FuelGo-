package com.nexfuel.auth.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class AuthException extends BaseException {
    
    public AuthException(ErrorCode errorCode) {
        super(errorCode);
    }
    
    public AuthException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
