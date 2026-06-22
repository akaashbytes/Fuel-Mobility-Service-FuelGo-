package com.nexfuel.customer.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class CustomerNotFoundException extends BaseException {
    
    public CustomerNotFoundException() {
        super(ErrorCode.USER_NOT_FOUND, "Customer profile not found");
    }

    public CustomerNotFoundException(String message) {
        super(ErrorCode.USER_NOT_FOUND, message);
    }
}
