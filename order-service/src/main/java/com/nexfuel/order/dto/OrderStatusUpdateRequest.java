package com.nexfuel.order.dto;

import com.nexfuel.order.entity.OrderState;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    @NotNull(message = "Target status is required")
    private OrderState status;

    @NotBlank(message = "Changed by actor label is required")
    private String changedBy; // CUSTOMER, PROVIDER, ADMIN

    private String notes;
}
