package com.nexfuel.collaborator.repository;

import com.nexfuel.collaborator.entity.CollaboratorServiceAreaEntity;
import com.nexfuel.collaborator.entity.CollaboratorServiceAreaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollaboratorServiceAreaRepository extends JpaRepository<CollaboratorServiceAreaEntity, CollaboratorServiceAreaId> {
    List<CollaboratorServiceAreaEntity> findByCollaboratorId(Long collaboratorId);
    List<CollaboratorServiceAreaEntity> findByServiceAreaId(Long serviceAreaId);
}
