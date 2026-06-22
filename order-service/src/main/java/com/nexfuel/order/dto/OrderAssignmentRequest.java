package com.nexfuel.order.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderAssignmentRequest {
    @NotNull(message = "Provider ID is required")
    private Long providerId;
}
