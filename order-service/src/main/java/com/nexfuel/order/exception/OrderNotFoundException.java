package com.nexfuel.order.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class OrderNotFoundException extends BaseException {
    
    public OrderNotFoundException() {
        super(ErrorCode.USER_NOT_FOUND, "Order not found");
    }

    public OrderNotFoundException(String message) {
        super(ErrorCode.USER_NOT_FOUND, message);
    }
}
