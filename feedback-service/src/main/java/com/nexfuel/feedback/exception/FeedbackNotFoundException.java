package com.nexfuel.feedback.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class FeedbackNotFoundException extends BaseException {
    public FeedbackNotFoundException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
