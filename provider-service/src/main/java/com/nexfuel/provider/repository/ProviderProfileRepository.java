package com.nexfuel.provider.repository;

import com.nexfuel.provider.entity.ProviderProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProviderProfileRepository extends JpaRepository<ProviderProfileEntity, Long> {
    Optional<ProviderProfileEntity> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
