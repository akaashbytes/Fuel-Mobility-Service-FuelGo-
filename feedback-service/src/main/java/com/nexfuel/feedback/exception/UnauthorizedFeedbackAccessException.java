package com.nexfuel.feedback.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class UnauthorizedFeedbackAccessException extends BaseException {
    public UnauthorizedFeedbackAccessException(String message) {
        super(ErrorCode.UNAUTHORIZED_ACCESS, message);
    }
}
