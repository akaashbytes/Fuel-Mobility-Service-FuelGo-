package com.nexfuel.customer.controller;

import com.nexfuel.customer.dto.VehicleRequest;
import com.nexfuel.customer.dto.VehicleResponse;
import com.nexfuel.shared.constant.SecurityConstants;
import com.nexfuel.customer.service.VehicleService;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers/vehicles")
@RequiredArgsConstructor
@Tag(name = "Customer Vehicles Center", description = "Endpoints for registering and managing customer vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    @Operation(summary = "Register a new vehicle", description = "Adds a new vehicle to the authenticated customer's profile")
    public ResponseEntity<ApiResponse<VehicleResponse>> addVehicle(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId,
            @Valid @RequestBody VehicleRequest request) {
        VehicleResponse response = vehicleService.addVehicle(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Vehicle registered successfully.", response));
    }

    @GetMapping
    @Operation(summary = "List registered vehicles", description = "Retrieves all vehicles registered to the authenticated customer's profile")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getVehicles(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId) {
        List<VehicleResponse> vehicles = vehicleService.getVehiclesByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Vehicles retrieved successfully.", vehicles));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update registered vehicle details", description = "Modifies an existing vehicle entry (verifies ownership)")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateVehicle(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId,
            @PathVariable("id") Long vehicleId,
            @Valid @RequestBody VehicleRequest request) {
        VehicleResponse response = vehicleService.updateVehicle(userId, vehicleId, request);
        return ResponseEntity.ok(ApiResponse.success("Vehicle updated successfully.", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete vehicle record", description = "Removes a vehicle entry from the database (verifies ownership)")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId,
            @PathVariable("id") Long vehicleId) {
        vehicleService.deleteVehicle(userId, vehicleId);
        return ResponseEntity.ok(ApiResponse.success("Vehicle record removed successfully."));
    }
}
