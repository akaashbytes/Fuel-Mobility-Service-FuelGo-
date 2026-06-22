package com.nexfuel.order.repository;

import com.nexfuel.order.entity.ServicePackageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicePackageRepository extends JpaRepository<ServicePackageEntity, Long> {
    List<ServicePackageEntity> findByStatus(String status);
}
