package com.nexfuel.customer.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class UnauthorizedVehicleAccessException extends BaseException {
    
    public UnauthorizedVehicleAccessException() {
        super(ErrorCode.ACCESS_DENIED, "You do not own this vehicle record");
    }

    public UnauthorizedVehicleAccessException(String message) {
        super(ErrorCode.ACCESS_DENIED, message);
    }
}
