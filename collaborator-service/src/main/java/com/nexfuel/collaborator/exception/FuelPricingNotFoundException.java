package com.nexfuel.collaborator.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class FuelPricingNotFoundException extends BaseException {
    
    public FuelPricingNotFoundException() {
        super(ErrorCode.USER_NOT_FOUND, "Fuel pricing not found");
    }

    public FuelPricingNotFoundException(String message) {
        super(ErrorCode.USER_NOT_FOUND, message);
    }
}
