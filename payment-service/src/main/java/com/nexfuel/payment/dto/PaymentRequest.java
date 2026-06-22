package com.nexfuel.payment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull(message = "Invoice ID is required")
    private Long invoiceId;

    @NotNull(message = "Payment method is required")
    @Size(max = 30, message = "Payment method must not exceed 30 characters")
    private String paymentMethod;

    @Size(max = 30, message = "Payment gateway name must not exceed 30 characters")
    private String paymentGateway;

    @Size(max = 100, message = "Gateway payment ID must not exceed 100 characters")
    private String gatewayPaymentId;
}
