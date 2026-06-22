package com.nexfuel.provider.dto;

import com.nexfuel.provider.entity.AvailabilityStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProviderAvailabilityRequest {
    @NotNull(message = "Availability status is required")
    private AvailabilityStatus status;
}
