package com.nexfuel.provider.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class ProviderNotFoundException extends BaseException {
    
    public ProviderNotFoundException() {
        super(ErrorCode.USER_NOT_FOUND, "Provider profile not found");
    }

    public ProviderNotFoundException(String message) {
        super(ErrorCode.USER_NOT_FOUND, message);
    }
}
