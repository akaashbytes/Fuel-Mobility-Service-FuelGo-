package com.nexfuel.collaborator.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "COLLABORATORS")
@Getter
@Setter
@NoArgsConstructor
public class CollaboratorEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_collaborators")
    @SequenceGenerator(name = "seq_collaborators", sequenceName = "SEQ_COLLABORATORS", allocationSize = 1)
    private Long id;

    @NotBlank(message = "Collaborator name is required")
    @Size(max = 150, message = "Name cannot exceed 150 characters")
    @Column(name = "NAME", nullable = false, length = 150)
    private String name;

    @NotBlank(message = "Contact person name is required")
    @Size(max = 100, message = "Contact person name cannot exceed 100 characters")
    @Column(name = "CONTACT_PERSON", nullable = false, length = 100)
    private String contactPerson;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    @Column(name = "EMAIL", nullable = false, unique = true, length = 150)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(max = 30, message = "Phone number cannot exceed 30 characters")
    @Column(name = "PHONE_NUMBER", nullable = false, length = 30)
    private String phoneNumber;

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    @Column(name = "ADDRESS", nullable = false, length = 255)
    private String address;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private CollaboratorStatus status = CollaboratorStatus.PROSPECT;

    @NotNull(message = "Contract expiry date is required")
    @Column(name = "CONTRACT_EXPIRY_DATE", nullable = false)
    private LocalDate contractExpiryDate;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    @Column(name = "NOTES", length = 1000)
    private String notes;

    @Column(name = "LATITUDE")
    private Double latitude;

    @Column(name = "LONGITUDE")
    private Double longitude;

    @OneToMany(mappedBy = "collaborator", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CollaboratorFuelPricingEntity> fuelPricings = new ArrayList<>();

    @OneToMany(mappedBy = "collaborator", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CollaboratorServiceAreaEntity> serviceAreas = new ArrayList<>();
}
