package com.nexfuel.payment.service;

import com.nexfuel.payment.dto.PaymentDashboardResponse;
import com.nexfuel.payment.entity.InvoiceStatus;
import com.nexfuel.payment.entity.LedgerEntryType;
import com.nexfuel.payment.entity.LedgerPurpose;
import com.nexfuel.payment.repository.CompanyLedgerRepository;
import com.nexfuel.payment.repository.OrderInvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CompanyLedgerRepository ledgerRepository;
    private final OrderInvoiceRepository invoiceRepository;

    public PaymentDashboardResponse getDashboardData() {
        BigDecimal totalRevenue = ledgerRepository.sumAmountByPurpose(LedgerPurpose.FUEL_REVENUE);
        BigDecimal companyCommissions = ledgerRepository.sumAmountByPurpose(LedgerPurpose.COMPANY_COMMISSION);
        BigDecimal providerPayouts = ledgerRepository.sumAmountByPurpose(LedgerPurpose.PROVIDER_PAYOUT);

        BigDecimal debits = ledgerRepository.sumAmountByEntryType(LedgerEntryType.DEBIT);
        BigDecimal credits = ledgerRepository.sumAmountByEntryType(LedgerEntryType.CREDIT);

        long activeInvoices = invoiceRepository.findAll().stream()
                .filter(inv -> inv.getStatus() == InvoiceStatus.PENDING)
                .count();

        return PaymentDashboardResponse.builder()
                .totalRevenue(totalRevenue)
                .companyCommissions(companyCommissions)
                .providerPayouts(providerPayouts)
                .activeInvoicesCount(activeInvoices)
                .ledgerDebitSum(debits)
                .ledgerCreditSum(credits)
                .build();
    }
}
