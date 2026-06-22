package com.nexfuel.auth.service;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class OtpGenerator {

    private final SecureRandom secureRandom = new SecureRandom();

    public String generate6DigitOtp() {
        int number = secureRandom.nextInt(900000) + 100000;
        return String.valueOf(number);
    }
}
