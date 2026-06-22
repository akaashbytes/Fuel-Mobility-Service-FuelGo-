package com.nexfuel.payment.controller;

import com.nexfuel.payment.dto.*;
import com.nexfuel.payment.service.DashboardService;
import com.nexfuel.payment.service.InvoiceService;
import com.nexfuel.payment.service.PaymentService;
import com.nexfuel.payment.service.SettlementService;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Management API", description = "Endpoints for invoicing, customer payment execution, refunds, provider settlements, and financial ledger dashboards")
public class PaymentController {

    private final PaymentService paymentService;
    private final InvoiceService invoiceService;
    private final SettlementService settlementService;
    private final DashboardService dashboardService;

    @PostMapping
    @Operation(summary = "Execute customer payment", description = "Processes payment for a pending order invoice, creates ledger transaction logs, and triggers provider settlement.")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.processPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully.", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment details", description = "Retrieves information about a specific payment by ID.")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long id) {
        PaymentResponse response = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully.", response));
    }

    @GetMapping("/history")
    @Operation(summary = "Get payment history", description = "Lists all customer payment transactions recorded in the system.")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentHistory() {
        List<PaymentResponse> response = paymentService.getPaymentHistory();
        return ResponseEntity.ok(ApiResponse.success("Payment history retrieved successfully.", response));
    }

    @PostMapping("/refund/{id}")
    @Operation(summary = "Process refund", description = "Processes refund for a successful payment, updates ledger with recovery debits, and cancels pending provider settlements.")
    public ResponseEntity<ApiResponse<PaymentResponse>> processRefund(@PathVariable Long id) {
        PaymentResponse response = paymentService.processRefund(id);
        return ResponseEntity.ok(ApiResponse.success("Refund processed successfully.", response));
    }

    @PostMapping("/invoices")
    @Operation(summary = "Create order invoice", description = "Generates a new pending invoice for a completed order, with 10% tax automatically calculated.")
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(
            @RequestParam Long orderId,
            @RequestParam BigDecimal amount) {
        InvoiceResponse response = invoiceService.createInvoice(orderId, amount);
        return ResponseEntity.ok(ApiResponse.success("Invoice generated successfully.", response));
    }

    @GetMapping("/invoices/order/{orderId}")
    @Operation(summary = "Get invoice by order ID", description = "Retrieves billing invoice information for a specific order ID.")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceByOrderId(@PathVariable Long orderId) {
        InvoiceResponse response = invoiceService.getInvoiceByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.success("Invoice retrieved successfully.", response));
    }

    @PostMapping("/settlements")
    @Operation(summary = "Process provider settlement payout", description = "Processes and executes payout for a provider settlement, logging a ledger debit.")
    public ResponseEntity<ApiResponse<ProviderSettlementResponse>> processSettlement(@RequestParam Long settlementId) {
        ProviderSettlementResponse response = settlementService.processSettlement(settlementId);
        return ResponseEntity.ok(ApiResponse.success("Provider settlement payout processed successfully.", response));
    }

    @GetMapping("/settlements")
    @Operation(summary = "Get settlements list", description = "Lists provider settlements, optionally filtered by provider ID.")
    public ResponseEntity<ApiResponse<List<ProviderSettlementResponse>>> getSettlements(
            @RequestParam(required = false) Long providerId) {
        List<ProviderSettlementResponse> response = (providerId != null) 
                ? settlementService.getSettlementsByProvider(providerId)
                : settlementService.getAllSettlements();
        return ResponseEntity.ok(ApiResponse.success("Provider settlements retrieved successfully.", response));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get financial ledger metrics", description = "Aggregates revenue metrics, platform commissions, provider payouts, active invoice counts, and ledger details.")
    public ResponseEntity<ApiResponse<PaymentDashboardResponse>> getDashboard() {
        PaymentDashboardResponse response = dashboardService.getDashboardData();
        return ResponseEntity.ok(ApiResponse.success("Financial dashboard data retrieved successfully.", response));
    }
}
