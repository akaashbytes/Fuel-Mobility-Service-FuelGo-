package com.nexfuel.collaborator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollaboratorDashboardResponse {
    private long totalCollaborators;
    private long activePartners;
    private long totalServiceAreas;
    private List<CollaboratorResponse> collaborators;
    private List<ServiceAreaResponse> serviceAreas;
}
