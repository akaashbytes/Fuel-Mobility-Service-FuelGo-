package com.nexfuel.provider.repository;

import com.nexfuel.provider.entity.ProviderDocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProviderDocumentRepository extends JpaRepository<ProviderDocumentEntity, Long> {
    List<ProviderDocumentEntity> findByProviderProfileId(Long profileId);
}
