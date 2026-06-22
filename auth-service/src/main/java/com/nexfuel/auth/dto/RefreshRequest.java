package com.nexfuel.auth.dto;

import lombok.Data;

@Data
public class RefreshRequest {
    // Refresh token can be passed in request body or cookie.
    // This is optional if reading from HttpOnly cookies, but useful for compatibility.
    private String refreshToken;
}
