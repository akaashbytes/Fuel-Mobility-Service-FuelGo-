package com.nexfuel.payment.service;

import com.nexfuel.payment.dto.PaymentRequest;
import com.nexfuel.payment.dto.PaymentResponse;
import com.nexfuel.payment.dto.PaymentTransactionResponse;
import com.nexfuel.payment.entity.*;
import com.nexfuel.payment.repository.PaymentRepository;
import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceService invoiceService;
    private final LedgerService ledgerService;
    private final SettlementService settlementService;

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        OrderInvoiceEntity invoice = invoiceService.getInvoiceEntity(request.getInvoiceId());

        if (invoice.getStatus() != InvoiceStatus.PENDING) {
            throw new BaseException(ErrorCode.BAD_REQUEST, "Invoice is not in PENDING state.");
        }

        // 1. Create Payment Entity
        PaymentEntity payment = new PaymentEntity();
        payment.setInvoice(invoice);
        payment.setAmount(invoice.getTotalAmount());
        payment.setStatus(PaymentStatus.SUCCESS); // Assume successful charge
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentGateway(request.getPaymentGateway() != null ? request.getPaymentGateway() : "STRIPE");
        payment.setGatewayPaymentId(request.getGatewayPaymentId() != null ? request.getGatewayPaymentId() : "ch_" + UUID.randomUUID().toString().substring(0, 16));

        // 2. Create Transaction attempt log
        PaymentTransactionEntity tx = new PaymentTransactionEntity();
        tx.setTransactionReference("tx_" + UUID.randomUUID().toString().substring(0, 16));
        tx.setType(TransactionType.CHARGE);
        tx.setStatus(TransactionStatus.SUCCESS);
        tx.setAmount(invoice.getTotalAmount());
        tx.setGatewayResponseCode("200");
        tx.setGatewayResponseMessage("Approved");
        payment.addTransaction(tx);

        // 3. Update Invoice Status
        invoice.setStatus(InvoiceStatus.PAID);

        // Save payment first to generate ID
        PaymentEntity savedPayment = paymentRepository.save(payment);

        // 4. Record Credits in Company Ledger
        BigDecimal gross = invoice.getTotalAmount();
        BigDecimal tax = invoice.getTax();
        BigDecimal netFuel = invoice.getAmount();
        
        // Ledger entry for gross fuel revenue
        ledgerService.recordCredit(savedPayment, netFuel, LedgerPurpose.FUEL_REVENUE, 
                "Gross fuel revenue collected from order " + invoice.getOrderId());
        
        // Ledger entry for tax collection
        ledgerService.recordCredit(savedPayment, tax, LedgerPurpose.TAX_COLLECTION, 
                "Tax collection from order " + invoice.getOrderId());

        // Platform fee/commission: Let's assume 15% platform fee
        BigDecimal commissionRate = new BigDecimal("0.15");
        BigDecimal commission = gross.multiply(commissionRate).setScale(2, RoundingMode.HALF_UP);
        ledgerService.recordCredit(savedPayment, commission, LedgerPurpose.COMPANY_COMMISSION, 
                "Platform fee commission from order " + invoice.getOrderId());

        // 5. Trigger Provider Settlement creation (assume mock provider ID 101L)
        settlementService.createSettlement(savedPayment, 101L);

        return mapToResponse(savedPayment);
    }

    @Transactional
    public PaymentResponse processRefund(Long paymentId) {
        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BaseException(ErrorCode.BAD_REQUEST, "Payment not found with ID: " + paymentId));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new BaseException(ErrorCode.BAD_REQUEST, "Only successful payments can be refunded.");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        payment.getInvoice().setStatus(InvoiceStatus.CANCELLED);

        // Add refund transaction log
        PaymentTransactionEntity refundTx = new PaymentTransactionEntity();
        refundTx.setTransactionReference("ref_" + UUID.randomUUID().toString().substring(0, 16));
        refundTx.setType(TransactionType.REFUND);
        refundTx.setStatus(TransactionStatus.SUCCESS);
        refundTx.setAmount(payment.getAmount());
        refundTx.setGatewayResponseCode("200");
        refundTx.setGatewayResponseMessage("Refund processed");
        payment.addTransaction(refundTx);

        PaymentEntity saved = paymentRepository.save(payment);

        // Record refund as debit in ledger
        ledgerService.recordDebit(payment.getSettlement(), payment.getAmount(), LedgerPurpose.RECOVERY, 
                "Refund processed for payment ID: " + payment.getId());

        // If provider settlement is pending, mark it failed/cancelled
        if (payment.getSettlement() != null && payment.getSettlement().getStatus() == SettlementStatus.PENDING) {
            payment.getSettlement().setStatus(SettlementStatus.FAILED);
        }

        return mapToResponse(saved);
    }

    public PaymentResponse getPaymentById(Long id) {
        PaymentEntity payment = paymentRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.BAD_REQUEST, "Payment not found ID: " + id));
        return mapToResponse(payment);
    }

    public List<PaymentResponse> getPaymentHistory() {
        return paymentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PaymentResponse mapToResponse(PaymentEntity entity) {
        List<PaymentTransactionResponse> txList = entity.getTransactions().stream()
                .map(tx -> PaymentTransactionResponse.builder()
                        .id(tx.getId())
                        .transactionReference(tx.getTransactionReference())
                        .type(tx.getType())
                        .status(tx.getStatus())
                        .amount(tx.getAmount())
                        .gatewayResponseCode(tx.getGatewayResponseCode())
                        .gatewayResponseMessage(tx.getGatewayResponseMessage())
                        .createdAt(tx.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return PaymentResponse.builder()
                .id(entity.getId())
                .invoiceId(entity.getInvoice().getId())
                .orderId(entity.getInvoice().getOrderId())
                .amount(entity.getAmount())
                .status(entity.getStatus())
                .paymentMethod(entity.getPaymentMethod())
                .paymentGateway(entity.getPaymentGateway())
                .gatewayPaymentId(entity.getGatewayPaymentId())
                .transactions(txList)
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
