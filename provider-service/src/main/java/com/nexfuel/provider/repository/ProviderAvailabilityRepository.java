package com.nexfuel.provider.repository;

import com.nexfuel.provider.entity.ProviderAvailabilityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderAvailabilityRepository extends JpaRepository<ProviderAvailabilityEntity, Long> {
    List<ProviderAvailabilityEntity> findByProviderProfileIdOrderByLastActiveAtDesc(Long profileId);
    Optional<ProviderAvailabilityEntity> findFirstByProviderProfileIdOrderByLastActiveAtDesc(Long profileId);
}
