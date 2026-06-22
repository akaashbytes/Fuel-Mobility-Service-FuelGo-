package com.nexfuel.collaborator.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;

public class CollaboratorNotFoundException extends BaseException {
    
    public CollaboratorNotFoundException() {
        super(ErrorCode.USER_NOT_FOUND, "Collaborator not found");
    }

    public CollaboratorNotFoundException(String message) {
        super(ErrorCode.USER_NOT_FOUND, message);
    }
}
