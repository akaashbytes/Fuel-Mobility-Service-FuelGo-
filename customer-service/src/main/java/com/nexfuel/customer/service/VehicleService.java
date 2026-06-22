package com.nexfuel.customer.service;

import com.nexfuel.customer.dto.VehicleRequest;
import com.nexfuel.customer.dto.VehicleResponse;
import com.nexfuel.customer.entity.CustomerProfileEntity;
import com.nexfuel.customer.entity.VehicleEntity;
import com.nexfuel.customer.exception.CustomerNotFoundException;
import com.nexfuel.customer.exception.UnauthorizedVehicleAccessException;
import com.nexfuel.customer.exception.VehicleNotFoundException;
import com.nexfuel.customer.repository.CustomerProfileRepository;
import com.nexfuel.customer.repository.VehicleRepository;
import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final CustomerProfileRepository customerProfileRepository;

    @Transactional
    public VehicleResponse addVehicle(Long userId, VehicleRequest request) {
        CustomerProfileEntity profile = customerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomerNotFoundException("Profile not found for user ID: " + userId));

        if (vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new BaseException(ErrorCode.BAD_REQUEST, "License plate is already registered: " + request.getLicensePlate());
        }

        VehicleEntity vehicle = new VehicleEntity();
        vehicle.setCustomerProfile(profile);
        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setLicensePlate(request.getLicensePlate());
        vehicle.setFuelType(request.getFuelType());

        VehicleEntity saved = vehicleRepository.save(vehicle);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> getVehiclesByUserId(Long userId) {
        CustomerProfileEntity profile = customerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomerNotFoundException("Profile not found for user ID: " + userId));

        return vehicleRepository.findByCustomerProfileId(profile.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VehicleResponse updateVehicle(Long userId, Long vehicleId, VehicleRequest request) {
        VehicleEntity vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle record not found with ID: " + vehicleId));

        // Ownership validation: verify vehicle belongs to current customer
        if (!vehicle.getCustomerProfile().getUserId().equals(userId)) {
            throw new UnauthorizedVehicleAccessException();
        }

        // License plate unique check (skip checking own license plate)
        if (!vehicle.getLicensePlate().equalsIgnoreCase(request.getLicensePlate())
                && vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new BaseException(ErrorCode.BAD_REQUEST, "License plate is already registered: " + request.getLicensePlate());
        }

        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setLicensePlate(request.getLicensePlate());
        vehicle.setFuelType(request.getFuelType());

        VehicleEntity updated = vehicleRepository.save(vehicle);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteVehicle(Long userId, Long vehicleId) {
        VehicleEntity vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle record not found with ID: " + vehicleId));

        // Ownership validation
        if (!vehicle.getCustomerProfile().getUserId().equals(userId)) {
            throw new UnauthorizedVehicleAccessException();
        }

        vehicleRepository.delete(vehicle);
    }

    private VehicleResponse mapToResponse(VehicleEntity entity) {
        return new VehicleResponse(
                entity.getId(),
                entity.getCustomerProfile().getId(),
                entity.getMake(),
                entity.getModel(),
                entity.getYear(),
                entity.getLicensePlate(),
                entity.getFuelType()
        );
    }
}
