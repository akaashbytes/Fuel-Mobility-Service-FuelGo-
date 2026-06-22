package com.nexfuel.admin.client;

import com.nexfuel.admin.dto.ClientDtos.CollaboratorDashboardResponse;
import com.nexfuel.admin.dto.ClientDtos.CollaboratorResponse;
import com.nexfuel.admin.dto.ClientDtos.CollaboratorRequest;
import com.nexfuel.shared.model.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "collaborator-service")
public interface CollaboratorServiceClient {

    @PostMapping("/api/v1/collaborators")
    ApiResponse<CollaboratorResponse> createCollaborator(@RequestBody CollaboratorRequest request);

    @GetMapping("/api/v1/collaborators")
    ApiResponse<List<CollaboratorResponse>> getAllCollaborators();

    @GetMapping("/api/v1/collaborators/{id}")
    ApiResponse<CollaboratorResponse> getCollaboratorById(@PathVariable("id") Long id);

    @PutMapping("/api/v1/collaborators/{id}")
    ApiResponse<CollaboratorResponse> updateCollaborator(@PathVariable("id") Long id, @RequestBody CollaboratorRequest request);

    @DeleteMapping("/api/v1/collaborators/{id}")
    ApiResponse<Void> deleteCollaborator(@PathVariable("id") Long id);

    @GetMapping("/api/v1/collaborators/dashboard")
    ApiResponse<CollaboratorDashboardResponse> getDashboard();
}
