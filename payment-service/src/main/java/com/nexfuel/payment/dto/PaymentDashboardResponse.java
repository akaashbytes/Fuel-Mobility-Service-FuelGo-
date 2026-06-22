package com.nexfuel.payment.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PaymentDashboardResponse {
    private BigDecimal totalRevenue;
    private BigDecimal companyCommissions;
    private BigDecimal providerPayouts;
    private Long activeInvoicesCount;
    private BigDecimal ledgerDebitSum;
    private BigDecimal ledgerCreditSum;
}
