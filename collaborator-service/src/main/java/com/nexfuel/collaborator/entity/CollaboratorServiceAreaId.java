package com.nexfuel.collaborator.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollaboratorServiceAreaId implements Serializable {
    private Long collaboratorId;
    private Long serviceAreaId;
}
