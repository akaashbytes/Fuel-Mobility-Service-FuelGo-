package com.nexfuel.order.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class ProviderUnavailableException extends BaseException {
    
    public ProviderUnavailableException() {
        super(ErrorCode.BAD_REQUEST, "Provider is currently unavailable or has not been approved");
    }

    public ProviderUnavailableException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
