package com.nexfuel.customer.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class VehicleNotFoundException extends BaseException {
    
    public VehicleNotFoundException() {
        super(ErrorCode.BAD_REQUEST, "Vehicle not found");
    }

    public VehicleNotFoundException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
