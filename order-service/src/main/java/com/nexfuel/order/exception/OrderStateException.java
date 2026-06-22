package com.nexfuel.order.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class OrderStateException extends BaseException {
    
    public OrderStateException() {
        super(ErrorCode.BAD_REQUEST, "Invalid order state transition or restriction");
    }

    public OrderStateException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
