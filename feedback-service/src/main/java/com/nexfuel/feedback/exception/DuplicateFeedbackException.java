package com.nexfuel.feedback.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class DuplicateFeedbackException extends BaseException {
    public DuplicateFeedbackException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
