package com.nexfuel.shared.util;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public final class ValidationUtil {

    private static final Validator VALIDATOR;

    static {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            VALIDATOR = factory.getValidator();
        }
    }

    private ValidationUtil() {
        // Prevent instantiation
    }

    public static <T> void validate(T object) {
        Set<ConstraintViolation<T>> violations = VALIDATOR.validate(object);
        if (!violations.isEmpty()) {
            Map<String, String> errors = new HashMap<>();
            for (ConstraintViolation<T> violation : violations) {
                errors.put(violation.getPropertyPath().toString(), violation.getMessage());
            }
            throw new BaseException(ErrorCode.BAD_REQUEST, "Validation failed: " + errors);
        }
    }
}
