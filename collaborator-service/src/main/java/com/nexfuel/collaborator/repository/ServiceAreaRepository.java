package com.nexfuel.collaborator.repository;

import com.nexfuel.collaborator.entity.ServiceAreaEntity;
import com.nexfuel.collaborator.entity.ServiceAreaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceAreaRepository extends JpaRepository<ServiceAreaEntity, Long> {
    List<ServiceAreaEntity> findByStatus(ServiceAreaStatus status);
}
