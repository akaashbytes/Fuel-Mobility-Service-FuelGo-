package com.nexfuel.collaborator.repository;

import com.nexfuel.collaborator.entity.CollaboratorFuelPricingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollaboratorFuelPricingRepository extends JpaRepository<CollaboratorFuelPricingEntity, Long> {
    List<CollaboratorFuelPricingEntity> findByCollaboratorId(Long collaboratorId);
    Optional<CollaboratorFuelPricingEntity> findByCollaboratorIdAndFuelType(Long collaboratorId, String fuelType);
}
