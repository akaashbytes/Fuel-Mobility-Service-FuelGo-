package com.nexfuel.payment.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "PAYMENTS")
public class PaymentEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payments_gen")
    @SequenceGenerator(name = "payments_gen", sequenceName = "payments_seq", allocationSize = 1)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false, unique = true)
    private OrderInvoiceEntity invoice;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PaymentStatus status;

    @NotNull
    @Size(max = 30)
    @Column(name = "payment_method", nullable = false, length = 30)
    private String paymentMethod;

    @Size(max = 30)
    @Column(name = "payment_gateway", length = 30)
    private String paymentGateway;

    @Size(max = 100)
    @Column(name = "gateway_payment_id", length = 100)
    private String gatewayPaymentId;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PaymentTransactionEntity> transactions = new ArrayList<>();

    @OneToOne(mappedBy = "payment", fetch = FetchType.LAZY)
    private ProviderSettlementEntity settlement;

    public void addTransaction(PaymentTransactionEntity transaction) {
        transactions.add(transaction);
        transaction.setPayment(this);
    }
}
