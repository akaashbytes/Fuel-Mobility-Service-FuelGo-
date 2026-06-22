package com.nexfuel.tracking.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProviderLocationResponse {
    private Long providerId;
    private Double latitude;
    private Double longitude;
    private String status;
    private LocalDateTime lastUpdated;
}
