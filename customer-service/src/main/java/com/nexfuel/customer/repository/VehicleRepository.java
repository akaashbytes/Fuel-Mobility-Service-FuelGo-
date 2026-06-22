package com.nexfuel.customer.repository;

import com.nexfuel.customer.entity.VehicleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<VehicleEntity, Long> {
    List<VehicleEntity> findByCustomerProfileId(Long profileId);
    boolean existsByLicensePlate(String licensePlate);
    Optional<VehicleEntity> findByLicensePlate(String licensePlate);
}
