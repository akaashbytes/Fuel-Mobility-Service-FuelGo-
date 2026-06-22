package com.nexfuel.tracking.repository;

import com.nexfuel.tracking.document.ProviderLocationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderLocationRepository extends MongoRepository<ProviderLocationDocument, String> {
    Optional<ProviderLocationDocument> findByProviderId(Long providerId);
    List<ProviderLocationDocument> findByStatus(String status);
}
