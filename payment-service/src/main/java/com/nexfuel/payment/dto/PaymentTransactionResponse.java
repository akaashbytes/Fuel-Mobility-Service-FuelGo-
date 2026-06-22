package com.nexfuel.payment.dto;

import com.nexfuel.payment.entity.TransactionStatus;
import com.nexfuel.payment.entity.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentTransactionResponse {
    private Long id;
    private String transactionReference;
    private TransactionType type;
    private TransactionStatus status;
    private BigDecimal amount;
    private String gatewayResponseCode;
    private String gatewayResponseMessage;
    private LocalDateTime createdAt;
}
