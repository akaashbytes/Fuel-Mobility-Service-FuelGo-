package com.nexfuel.payment.service;

import com.nexfuel.payment.dto.ProviderSettlementResponse;
import com.nexfuel.payment.entity.*;
import com.nexfuel.payment.repository.ProviderSettlementRepository;
import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SettlementService {

    private final ProviderSettlementRepository settlementRepository;
    private final LedgerService ledgerService;

    @Transactional
    public ProviderSettlementEntity createSettlement(PaymentEntity payment, Long providerId) {
        BigDecimal total = payment.getAmount();
        BigDecimal commissionRate = new BigDecimal("0.15"); // 15% platform commission
        BigDecimal commission = total.multiply(commissionRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal payout = total.subtract(commission).setScale(2, RoundingMode.HALF_UP);

        ProviderSettlementEntity settlement = new ProviderSettlementEntity();
        settlement.setPayment(payment);
        settlement.setProviderId(providerId);
        settlement.setGrossAmount(total);
        settlement.setCommissionAmount(commission);
        settlement.setSettlementAmount(payout);
        settlement.setStatus(SettlementStatus.PENDING);

        return settlementRepository.save(settlement);
    }

    @Transactional
    public ProviderSettlementResponse processSettlement(Long settlementId) {
        ProviderSettlementEntity settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new BaseException(ErrorCode.BAD_REQUEST, "Settlement not found ID: " + settlementId));

        if (settlement.getStatus() == SettlementStatus.PROCESSED) {
            throw new BaseException(ErrorCode.BAD_REQUEST, "Settlement already processed.");
        }

        settlement.setStatus(SettlementStatus.PROCESSED);
        settlement.setSettledAt(LocalDateTime.now());

        ProviderSettlementEntity saved = settlementRepository.save(settlement);

        // Record provider payout as debit in ledger
        ledgerService.recordDebit(saved, saved.getSettlementAmount(), LedgerPurpose.PROVIDER_PAYOUT, 
                "Payout settled to provider ID: " + saved.getProviderId());

        return mapToResponse(saved);
    }

    public List<ProviderSettlementResponse> getSettlementsByProvider(Long providerId) {
        return settlementRepository.findByProviderId(providerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProviderSettlementResponse> getAllSettlements() {
        return settlementRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProviderSettlementResponse mapToResponse(ProviderSettlementEntity entity) {
        return ProviderSettlementResponse.builder()
                .id(entity.getId())
                .paymentId(entity.getPayment().getId())
                .providerId(entity.getProviderId())
                .grossAmount(entity.getGrossAmount())
                .commissionAmount(entity.getCommissionAmount())
                .settlementAmount(entity.getSettlementAmount())
                .status(entity.getStatus())
                .settledAt(entity.getSettledAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
