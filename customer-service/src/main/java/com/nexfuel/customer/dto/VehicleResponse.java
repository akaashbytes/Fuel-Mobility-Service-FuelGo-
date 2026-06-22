package com.nexfuel.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {
    private Long id;
    private Long customerProfileId;
    private String make;
    private String model;
    private int year;
    private String licensePlate;
    private String fuelType;
}
