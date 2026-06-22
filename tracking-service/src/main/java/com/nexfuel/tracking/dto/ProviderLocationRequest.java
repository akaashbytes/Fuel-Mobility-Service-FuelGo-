package com.nexfuel.tracking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProviderLocationRequest {
    @NotNull(message = "Provider ID is required")
    private Long providerId;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Status is required")
    private String status; // e.g. AVAILABLE, UNAVAILABLE, ON_JOB
}
