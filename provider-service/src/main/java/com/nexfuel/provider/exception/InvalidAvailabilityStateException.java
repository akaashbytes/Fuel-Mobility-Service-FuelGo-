package com.nexfuel.provider.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class InvalidAvailabilityStateException extends BaseException {
    
    public InvalidAvailabilityStateException() {
        super(ErrorCode.BAD_REQUEST, "Invalid availability state transition or setting");
    }

    public InvalidAvailabilityStateException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
