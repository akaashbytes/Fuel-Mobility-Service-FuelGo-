package com.nexfuel.collaborator.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CollaboratorFuelPricingRequest {

    @NotBlank(message = "Fuel type is required")
    @Size(max = 30, message = "Fuel type cannot exceed 30 characters")
    private String fuelType; // 87 Regular, 91 Premium, Diesel

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", message = "Price cannot be negative")
    private BigDecimal price;
}
