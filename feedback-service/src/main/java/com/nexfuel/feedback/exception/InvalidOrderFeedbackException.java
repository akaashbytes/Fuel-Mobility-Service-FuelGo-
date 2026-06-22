package com.nexfuel.feedback.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class InvalidOrderFeedbackException extends BaseException {
    public InvalidOrderFeedbackException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
