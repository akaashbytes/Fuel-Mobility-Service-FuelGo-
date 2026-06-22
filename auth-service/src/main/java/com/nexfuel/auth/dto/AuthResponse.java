package com.nexfuel.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nexfuel.shared.dto.UserSummaryDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String tokenType;
    private long expiresInSeconds;
    private UserSummaryDto user;
    
    @JsonIgnore // Exclude from JSON response body serialization for cookie-only security
    private String refreshToken;
}
