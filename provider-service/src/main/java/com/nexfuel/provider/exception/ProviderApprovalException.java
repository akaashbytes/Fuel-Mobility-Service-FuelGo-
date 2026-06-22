package com.nexfuel.provider.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class ProviderApprovalException extends BaseException {
    
    public ProviderApprovalException() {
        super(ErrorCode.ACCESS_DENIED, "Provider profile has not been approved by Admin");
    }

    public ProviderApprovalException(String message) {
        super(ErrorCode.ACCESS_DENIED, message);
    }
}
