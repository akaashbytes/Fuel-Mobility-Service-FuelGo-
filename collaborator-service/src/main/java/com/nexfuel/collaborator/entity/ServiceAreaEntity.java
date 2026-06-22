package com.nexfuel.collaborator.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "SERVICE_AREAS")
@Getter
@Setter
@NoArgsConstructor
public class ServiceAreaEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_service_areas")
    @SequenceGenerator(name = "seq_service_areas", sequenceName = "SEQ_SERVICE_AREAS", allocationSize = 1)
    private Long id;

    @NotBlank(message = "City name is required")
    @Size(max = 100, message = "City name cannot exceed 100 characters")
    @Column(name = "CITY", nullable = false, length = 100)
    private String city;

    @NotBlank(message = "Service area name is required")
    @Size(max = 100, message = "Service area name cannot exceed 100 characters")
    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private ServiceAreaStatus status = ServiceAreaStatus.ACTIVE;

    @NotBlank(message = "Polygon coordinates are required")
    @Lob
    @Column(name = "POLYGON_COORDS", nullable = false)
    private String polygonCoords; // JSON CLOB

    @OneToMany(mappedBy = "serviceArea", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CollaboratorServiceAreaEntity> collaborators = new ArrayList<>();
}
