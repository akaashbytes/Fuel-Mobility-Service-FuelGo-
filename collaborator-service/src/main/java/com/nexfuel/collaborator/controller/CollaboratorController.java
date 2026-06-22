package com.nexfuel.collaborator.controller;

import com.nexfuel.collaborator.dto.*;
import com.nexfuel.collaborator.service.*;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Collaborator Center", description = "Endpoints for collaborator partner profiles, fuel pricing updates, and service areas management")
public class CollaboratorController {

    private final CollaboratorService collaboratorService;
    private final FuelPricingService fuelPricingService;
    private final ServiceAreaService serviceAreaService;
    private final CollaboratorDashboardService collaboratorDashboardService;

    // ==========================================
    // Collaborator Profile Endpoints
    // ==========================================

    @PostMapping("/collaborators")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Create collaborator bunk", description = "Admin only. Registers a new collaborator partner")
    public ResponseEntity<ApiResponse<CollaboratorResponse>> createCollaborator(@Valid @RequestBody CollaboratorRequest request) {
        CollaboratorResponse response = collaboratorService.createCollaborator(request);
        return ResponseEntity.ok(ApiResponse.success("Collaborator registered successfully.", response));
    }

    @GetMapping("/collaborators")
    @Operation(summary = "List all collaborators", description = "Retrieves profiles for all registered bunk partners")
    public ResponseEntity<ApiResponse<List<CollaboratorResponse>>> getAllCollaborators() {
        List<CollaboratorResponse> list = collaboratorService.getAllCollaborators();
        return ResponseEntity.ok(ApiResponse.success("Collaborator list retrieved successfully.", list));
    }

    @GetMapping("/collaborators/{id}")
    @Operation(summary = "Get collaborator details", description = "Retrieves collaborator details by ID")
    public ResponseEntity<ApiResponse<CollaboratorResponse>> getCollaboratorById(@PathVariable Long id) {
        CollaboratorResponse response = collaboratorService.getCollaboratorById(id);
        return ResponseEntity.ok(ApiResponse.success("Collaborator retrieved successfully.", response));
    }

    @GetMapping("/collaborators/nearest")
    @Operation(summary = "Find nearest active collaborator station", description = "Locates closest ACTIVE collaborator refueling bunk using Haversine formula distance matching, optionally filtered by fuel type availability")
    public ResponseEntity<ApiResponse<CollaboratorResponse>> findNearestCollaborator(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(required = false) String fuelType) {
        CollaboratorResponse nearest = collaboratorService.findNearestCollaborator(latitude, longitude, fuelType);
        return ResponseEntity.ok(ApiResponse.success("Nearest collaborator resolved successfully.", nearest));
    }

    @GetMapping("/collaborators/search/by-region")
    @Operation(summary = "Filter collaborators by service area region", description = "Retrieves all collaborators associated with a specific service area ID")
    public ResponseEntity<ApiResponse<List<CollaboratorResponse>>> findCollaboratorsByRegion(
            @RequestParam Long serviceAreaId) {
        List<CollaboratorResponse> list = collaboratorService.findCollaboratorsByRegion(serviceAreaId);
        return ResponseEntity.ok(ApiResponse.success("Region collaborators list retrieved successfully.", list));
    }

    @GetMapping("/collaborators/search/by-fuel")
    @Operation(summary = "Filter collaborators by fuel type availability", description = "Retrieves all collaborators that carry/sell a specific fuel grade")
    public ResponseEntity<ApiResponse<List<CollaboratorResponse>>> findCollaboratorsByFuelType(
            @RequestParam String fuelType) {
        List<CollaboratorResponse> list = collaboratorService.findCollaboratorsByFuelType(fuelType);
        return ResponseEntity.ok(ApiResponse.success("Collaborators carrying fuel type retrieved successfully.", list));
    }

    @PutMapping("/collaborators/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update collaborator profile", description = "Admin only. Modifies contact, status, or details")
    public ResponseEntity<ApiResponse<CollaboratorResponse>> updateCollaborator(
            @PathVariable Long id,
            @Valid @RequestBody CollaboratorRequest request) {
        CollaboratorResponse response = collaboratorService.updateCollaborator(id, request);
        return ResponseEntity.ok(ApiResponse.success("Collaborator updated successfully.", response));
    }

    @DeleteMapping("/collaborators/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete collaborator profile", description = "Admin only. Unregisters collaborator station from system")
    public ResponseEntity<ApiResponse<Void>> deleteCollaborator(@PathVariable Long id) {
        collaboratorService.deleteCollaborator(id);
        return ResponseEntity.ok(ApiResponse.success("Collaborator deleted successfully.", null));
    }

    // ==========================================
    // Fuel Pricing Endpoints
    // ==========================================

    @PostMapping("/collaborators/{id}/pricing")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Create pricing update", description = "Admin only. Registers pricing for Petrol, Diesel, or Premium")
    public ResponseEntity<ApiResponse<CollaboratorFuelPricingResponse>> addPricing(
            @PathVariable Long id,
            @Valid @RequestBody CollaboratorFuelPricingRequest request) {
        CollaboratorFuelPricingResponse pricing = fuelPricingService.addOrUpdatePricing(id, request);
        return ResponseEntity.ok(ApiResponse.success("Fuel pricing updated successfully.", pricing));
    }

    @PutMapping("/collaborators/{id}/pricing")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Modify pricing", description = "Admin only. Updates per-gallon pricing log")
    public ResponseEntity<ApiResponse<CollaboratorFuelPricingResponse>> updatePricing(
            @PathVariable Long id,
            @Valid @RequestBody CollaboratorFuelPricingRequest request) {
        CollaboratorFuelPricingResponse pricing = fuelPricingService.addOrUpdatePricing(id, request);
        return ResponseEntity.ok(ApiResponse.success("Fuel pricing modified successfully.", pricing));
    }

    @GetMapping("/collaborators/{id}/pricing")
    @Operation(summary = "Get collaborator fuel pricing", description = "List all pricing records for the specified bunk")
    public ResponseEntity<ApiResponse<List<CollaboratorFuelPricingResponse>>> getPricing(@PathVariable Long id) {
        List<CollaboratorFuelPricingResponse> pricing = fuelPricingService.getPricingByCollaboratorId(id);
        return ResponseEntity.ok(ApiResponse.success("Fuel pricing logs retrieved successfully.", pricing));
    }

    // ==========================================
    // Service Area Endpoints
    // ==========================================

    @PostMapping("/service-areas")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Create service area", description = "Admin only. Defines city coverage polygon bounds")
    public ResponseEntity<ApiResponse<ServiceAreaResponse>> createServiceArea(@Valid @RequestBody ServiceAreaRequest request) {
        ServiceAreaResponse response = serviceAreaService.createServiceArea(request);
        return ResponseEntity.ok(ApiResponse.success("Service area defined successfully.", response));
    }

    @GetMapping("/service-areas")
    @Operation(summary = "List all service areas", description = "Retrieves defined geographical service areas")
    public ResponseEntity<ApiResponse<List<ServiceAreaResponse>>> getAllServiceAreas() {
        List<ServiceAreaResponse> list = serviceAreaService.getAllServiceAreas();
        return ResponseEntity.ok(ApiResponse.success("Service areas list retrieved successfully.", list));
    }

    @GetMapping("/collaborators/dashboard")
    @Operation(summary = "Get collaborator management summary", description = "Admin/Collaborator dashboard metrics aggregates")
    public ResponseEntity<ApiResponse<CollaboratorDashboardResponse>> getDashboard() {
        CollaboratorDashboardResponse response = collaboratorDashboardService.getDashboardData();
        return ResponseEntity.ok(ApiResponse.success("Collaborator dashboard metrics retrieved successfully.", response));
    }
}
