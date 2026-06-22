package com.nexfuel.order.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateOrderRequest {

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotBlank(message = "Fuel type is required")
    @Size(max = 30)
    private String fuelType; // 87 Regular, 91 Premium, Diesel

    @NotNull(message = "Quantity in gallons is required")
    @DecimalMin(value = "0.01", message = "Quantity must be greater than zero")
    private BigDecimal quantityGallons;

    @NotNull(message = "Latitude is required")
    private Double targetLatitude;

    @NotNull(message = "Longitude is required")
    private Double targetLongitude;

    @NotBlank(message = "Target address is required")
    @Size(max = 255)
    private String targetAddress;
}
