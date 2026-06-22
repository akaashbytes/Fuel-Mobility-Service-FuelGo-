package com.nexfuel.collaborator.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "COLLABORATOR_SERVICE_AREAS")
@Getter
@Setter
@NoArgsConstructor
public class CollaboratorServiceAreaEntity {

    @EmbeddedId
    private CollaboratorServiceAreaId id = new CollaboratorServiceAreaId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("collaboratorId")
    @JoinColumn(name = "COLLABORATOR_ID", nullable = false)
    private CollaboratorEntity collaborator;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("serviceAreaId")
    @JoinColumn(name = "SERVICE_AREA_ID", nullable = false)
    private ServiceAreaEntity serviceArea;

    public CollaboratorServiceAreaEntity(CollaboratorEntity collaborator, ServiceAreaEntity serviceArea) {
        this.collaborator = collaborator;
        this.serviceArea = serviceArea;
        this.id = new CollaboratorServiceAreaId(
                collaborator.getId() != null ? collaborator.getId() : null,
                serviceArea.getId() != null ? serviceArea.getId() : null
        );
    }
}
