package com.nexfuel.customer.service;

import com.nexfuel.customer.dto.CustomerDashboardResponse;
import com.nexfuel.customer.dto.CustomerProfileResponse;
import com.nexfuel.customer.dto.VehicleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerDashboardService {

    private final CustomerProfileService customerProfileService;
    private final VehicleService vehicleService;

    @Transactional(readOnly = true)
    public CustomerDashboardResponse getDashboardData(Long userId) {
        CustomerProfileResponse profile = customerProfileService.getProfileByUserId(userId);
        List<VehicleResponse> vehicles = vehicleService.getVehiclesByUserId(userId);

        return new CustomerDashboardResponse(
                profile,
                vehicles,
                vehicles.size()
        );
    }
}
