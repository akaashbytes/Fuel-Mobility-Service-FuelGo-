package com.nexfuel.collaborator.dto;

import com.nexfuel.collaborator.entity.CollaboratorStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class CollaboratorRequest {

    @NotBlank(message = "Collaborator name is required")
    @Size(max = 150, message = "Name cannot exceed 150 characters")
    private String name;

    @NotBlank(message = "Contact person is required")
    @Size(max = 100, message = "Contact person cannot exceed 100 characters")
    private String contactPerson;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(max = 30, message = "Phone number cannot exceed 30 characters")
    private String phoneNumber;

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    private CollaboratorStatus status; // Defaults to PROSPECT if null

    @NotNull(message = "Contract expiry date is required")
    private LocalDate contractExpiryDate;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    private Double latitude;

    private Double longitude;

    @NotEmpty(message = "Collaborator must be associated with at least one service area ID")
    private List<Long> serviceAreaIds;
}
