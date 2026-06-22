package com.nexfuel.tracking.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class ProviderLocationNotFoundException extends BaseException {
    public ProviderLocationNotFoundException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
