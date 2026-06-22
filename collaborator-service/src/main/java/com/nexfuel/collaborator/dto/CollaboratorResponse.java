package com.nexfuel.collaborator.dto;

import com.nexfuel.collaborator.entity.CollaboratorStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollaboratorResponse {
    private Long id;
    private String name;
    private String contactPerson;
    private String email;
    private String phoneNumber;
    private String address;
    private CollaboratorStatus status;
    private LocalDate contractExpiryDate;
    private String notes;
    private Double latitude;
    private Double longitude;
    private List<Long> serviceAreaIds;
}
