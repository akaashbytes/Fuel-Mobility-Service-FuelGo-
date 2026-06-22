package com.nexfuel.admin.client;

import com.nexfuel.admin.dto.ClientDtos.PaymentDashboardResponse;
import com.nexfuel.admin.dto.ClientDtos.PaymentResponse;
import com.nexfuel.admin.dto.ClientDtos.InvoiceResponse;
import com.nexfuel.admin.dto.ClientDtos.ProviderSettlementResponse;
import com.nexfuel.shared.model.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@FeignClient(name = "payment-service")
public interface PaymentServiceClient {

    @GetMapping("/api/v1/payments/{id}")
    ApiResponse<PaymentResponse> getPaymentById(@PathVariable("id") Long id);

    @GetMapping("/api/v1/payments/history")
    ApiResponse<List<PaymentResponse>> getPaymentHistory();

    @PostMapping("/api/v1/payments/invoices")
    ApiResponse<InvoiceResponse> createInvoice(
            @RequestParam("orderId") Long orderId,
            @RequestParam("amount") BigDecimal amount
    );

    @GetMapping("/api/v1/payments/invoices/order/{orderId}")
    ApiResponse<InvoiceResponse> getInvoiceByOrderId(@PathVariable("orderId") Long orderId);

    @PostMapping("/api/v1/payments/settlements")
    ApiResponse<ProviderSettlementResponse> processSettlement(@RequestParam("settlementId") Long settlementId);

    @GetMapping("/api/v1/payments/settlements")
    ApiResponse<List<ProviderSettlementResponse>> getSettlements(
            @RequestParam(value = "providerId", required = false) Long providerId
    );

    @GetMapping("/api/v1/payments/dashboard")
    ApiResponse<PaymentDashboardResponse> getDashboard();
}
