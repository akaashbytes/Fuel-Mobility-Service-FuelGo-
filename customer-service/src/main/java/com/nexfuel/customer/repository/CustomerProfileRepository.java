package com.nexfuel.customer.repository;

import com.nexfuel.customer.entity.CustomerProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfileEntity, Long> {
    Optional<CustomerProfileEntity> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
