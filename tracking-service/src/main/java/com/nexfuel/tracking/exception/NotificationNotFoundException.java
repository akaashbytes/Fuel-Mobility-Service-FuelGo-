package com.nexfuel.tracking.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class NotificationNotFoundException extends BaseException {
    public NotificationNotFoundException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
