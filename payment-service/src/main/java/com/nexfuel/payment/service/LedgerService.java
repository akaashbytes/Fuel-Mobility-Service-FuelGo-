package com.nexfuel.payment.service;

import com.nexfuel.payment.entity.*;
import com.nexfuel.payment.repository.CompanyLedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class LedgerService {

    private final CompanyLedgerRepository ledgerRepository;

    @Transactional
    public void recordCredit(PaymentEntity payment, BigDecimal amount, LedgerPurpose purpose, String description) {
        CompanyLedgerEntity entry = new CompanyLedgerEntity();
        entry.setPayment(payment);
        entry.setEntryType(LedgerEntryType.CREDIT);
        entry.setAmount(amount);
        entry.setPurpose(purpose);
        entry.setDescription(description);
        ledgerRepository.save(entry);
    }

    @Transactional
    public void recordDebit(ProviderSettlementEntity settlement, BigDecimal amount, LedgerPurpose purpose, String description) {
        CompanyLedgerEntity entry = new CompanyLedgerEntity();
        entry.setSettlement(settlement);
        entry.setEntryType(LedgerEntryType.DEBIT);
        entry.setAmount(amount);
        entry.setPurpose(purpose);
        entry.setDescription(description);
        ledgerRepository.save(entry);
    }
}
