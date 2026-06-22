package com.nexfuel.customer.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VehicleRequest {

    @NotBlank(message = "Make is required")
    @Size(max = 50, message = "Make cannot exceed 50 characters")
    private String make;

    @NotBlank(message = "Model is required")
    @Size(max = 50, message = "Model cannot exceed 50 characters")
    private String model;

    @Min(value = 1900, message = "Year must be valid")
    @Max(value = 2100, message = "Year must be valid")
    private int year;

    @NotBlank(message = "License plate is required")
    @Size(max = 30, message = "License plate cannot exceed 30 characters")
    private String licensePlate;

    @NotBlank(message = "Fuel type is required")
    @Size(max = 30, message = "Fuel type cannot exceed 30 characters")
    private String fuelType; // Regular, Premium, Diesel
}
