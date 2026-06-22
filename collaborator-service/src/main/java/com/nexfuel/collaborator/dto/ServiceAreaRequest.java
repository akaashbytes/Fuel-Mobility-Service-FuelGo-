package com.nexfuel.collaborator.dto;

import com.nexfuel.collaborator.entity.ServiceAreaStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ServiceAreaRequest {

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;

    @NotBlank(message = "Service area name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    private ServiceAreaStatus status; // Defaults to ACTIVE if null

    @NotBlank(message = "Polygon coordinates are required")
    private String polygonCoords; // JSON CLOB string
}
