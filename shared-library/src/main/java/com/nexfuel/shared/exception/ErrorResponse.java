package com.nexfuel.shared.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
    int status,
    String error,
    String message,
    Map<String, String> details,
    LocalDateTime timestamp
) {
    public static ErrorResponse of(int status, String error, String message) {
        return new ErrorResponse(status, error, message, null, LocalDateTime.now());
    }

    public static ErrorResponse of(int status, String error, String message, Map<String, String> details) {
        return new ErrorResponse(status, error, message, details, LocalDateTime.now());
    }
}
