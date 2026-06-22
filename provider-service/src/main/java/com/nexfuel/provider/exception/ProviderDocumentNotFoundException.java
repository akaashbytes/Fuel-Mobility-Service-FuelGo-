package com.nexfuel.provider.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class ProviderDocumentNotFoundException extends BaseException {
    
    public ProviderDocumentNotFoundException() {
        super(ErrorCode.USER_NOT_FOUND, "Provider document not found");
    }

    public ProviderDocumentNotFoundException(String message) {
        super(ErrorCode.USER_NOT_FOUND, message);
    }
}
