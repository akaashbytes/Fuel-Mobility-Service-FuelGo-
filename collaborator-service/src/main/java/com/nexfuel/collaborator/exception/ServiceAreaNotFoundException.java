package com.nexfuel.collaborator.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class ServiceAreaNotFoundException extends BaseException {
    
    public ServiceAreaNotFoundException() {
        super(ErrorCode.USER_NOT_FOUND, "Service area not found");
    }

    public ServiceAreaNotFoundException(String message) {
        super(ErrorCode.USER_NOT_FOUND, message);
    }
}
