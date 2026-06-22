package com.nexfuel.payment.repository;

import com.nexfuel.payment.entity.ProviderSettlementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderSettlementRepository extends JpaRepository<ProviderSettlementEntity, Long> {
    List<ProviderSettlementEntity> findByProviderId(Long providerId);
    Optional<ProviderSettlementEntity> findByPaymentId(Long paymentId);
}
