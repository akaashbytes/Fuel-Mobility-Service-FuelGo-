package com.nexfuel.payment.service;

import com.nexfuel.payment.dto.InvoiceResponse;
import com.nexfuel.payment.entity.InvoiceStatus;
import com.nexfuel.payment.entity.OrderInvoiceEntity;
import com.nexfuel.payment.repository.OrderInvoiceRepository;
import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final OrderInvoiceRepository invoiceRepository;

    @Transactional
    public InvoiceResponse createInvoice(Long orderId, BigDecimal amount) {
        if (invoiceRepository.existsByOrderId(orderId)) {
            throw new BaseException(ErrorCode.BAD_REQUEST, "Invoice already exists for order ID: " + orderId);
        }

        BigDecimal taxRate = new BigDecimal("0.10"); // 10% tax
        BigDecimal tax = amount.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = amount.add(tax).setScale(2, RoundingMode.HALF_UP);

        OrderInvoiceEntity invoice = new OrderInvoiceEntity();
        invoice.setOrderId(orderId);
        invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        invoice.setAmount(amount);
        invoice.setTax(tax);
        invoice.setTotalAmount(total);
        invoice.setStatus(InvoiceStatus.PENDING);
        invoice.setDueDate(LocalDateTime.now().plusDays(7)); // Due in 7 days

        OrderInvoiceEntity saved = invoiceRepository.save(invoice);
        return mapToResponse(saved);
    }

    public InvoiceResponse getInvoiceByOrderId(Long orderId) {
        OrderInvoiceEntity invoice = invoiceRepository.findByOrderId(orderId)
                .orElseThrow(() -> new BaseException(ErrorCode.BAD_REQUEST, "Invoice not found for order ID: " + orderId));
        return mapToResponse(invoice);
    }

    public OrderInvoiceEntity getInvoiceEntity(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.BAD_REQUEST, "Invoice not found with ID: " + id));
    }

    public InvoiceResponse mapToResponse(OrderInvoiceEntity entity) {
        return InvoiceResponse.builder()
                .id(entity.getId())
                .orderId(entity.getOrderId())
                .invoiceNumber(entity.getInvoiceNumber())
                .amount(entity.getAmount())
                .tax(entity.getTax())
                .totalAmount(entity.getTotalAmount())
                .status(entity.getStatus())
                .dueDate(entity.getDueDate())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
