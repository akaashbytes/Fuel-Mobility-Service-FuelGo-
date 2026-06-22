package com.nexfuel.collaborator.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class CollaboratorValidationException extends BaseException {
    
    public CollaboratorValidationException() {
        super(ErrorCode.BAD_REQUEST, "Collaborator validation failed");
    }

    public CollaboratorValidationException(String message) {
        super(ErrorCode.BAD_REQUEST, message);
    }
}
