package com.nexfuel.order.exception;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(BaseException ex) {
        HttpStatus status = HttpStatus.valueOf(ex.getErrorCode().getStatus());
        ErrorResponse response = ErrorResponse.of(
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage()
        );
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        HttpStatus status = HttpStatus.BAD_REQUEST;
        ErrorResponse response = ErrorResponse.of(
                status.value(),
                status.getReasonPhrase(),
                "Validation failed",
                errors
        );
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        ErrorResponse response = ErrorResponse.of(
                status.value(),
                status.getReasonPhrase(),
                "An unexpected internal error occurred: " + ex.getMessage()
        );
        return ResponseEntity.status(status).body(response);
    }
}
