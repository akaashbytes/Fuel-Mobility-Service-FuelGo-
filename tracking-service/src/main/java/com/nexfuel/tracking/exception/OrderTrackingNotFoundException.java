package com.nexfuel.tracking.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class OrderTrackingNotFoundException extends BaseException {
    public OrderTrackingNotFoundException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
