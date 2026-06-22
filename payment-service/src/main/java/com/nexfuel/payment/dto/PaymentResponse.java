package com.nexfuel.payment.dto;

import com.nexfuel.payment.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PaymentResponse {
    private Long id;
    private Long invoiceId;
    private Long orderId;
    private BigDecimal amount;
    private PaymentStatus status;
    private String paymentMethod;
    private String paymentGateway;
    private String gatewayPaymentId;
    private List<PaymentTransactionResponse> transactions;
    private LocalDateTime createdAt;
}
