package com.nexfuel.payment.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "ORDER_INVOICES")
public class OrderInvoiceEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_invoices_gen")
    @SequenceGenerator(name = "order_invoices_gen", sequenceName = "order_invoices_seq", allocationSize = 1)
    private Long id;

    @NotNull
    @Column(name = "order_id", nullable = false, unique = true)
    private Long orderId;

    @NotNull
    @Size(max = 50)
    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "tax", nullable = false, precision = 10, scale = 2)
    private BigDecimal tax;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private InvoiceStatus status;

    @NotNull
    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @OneToOne(mappedBy = "invoice", fetch = FetchType.LAZY)
    private PaymentEntity payment;
}
