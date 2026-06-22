package com.nexfuel.provider.repository;

import com.nexfuel.provider.entity.ProviderEarningsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProviderEarningsRepository extends JpaRepository<ProviderEarningsEntity, Long> {
    Optional<ProviderEarningsEntity> findByProviderProfileId(Long profileId);
}
