package com.nexfuel.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDashboardResponse {
    private CustomerProfileResponse profile;
    private List<VehicleResponse> vehicles;
    private int totalVehiclesCount;
}
