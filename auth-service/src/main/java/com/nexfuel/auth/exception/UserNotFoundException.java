package com.nexfuel.auth.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class UserNotFoundException extends BaseException {
    
    public UserNotFoundException() {
        super(ErrorCode.USER_NOT_FOUND);
    }
    
    public UserNotFoundException(String message) {
        super(ErrorCode.USER_NOT_FOUND, message);
    }
}
