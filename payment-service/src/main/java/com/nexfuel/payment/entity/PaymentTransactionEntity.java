package com.nexfuel.payment.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "PAYMENT_TRANSACTIONS")
public class PaymentTransactionEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "transactions_gen")
    @SequenceGenerator(name = "transactions_gen", sequenceName = "payment_transactions_seq", allocationSize = 1)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private PaymentEntity payment;

    @NotNull
    @Size(max = 100)
    @Column(name = "transaction_reference", nullable = false, unique = true, length = 100)
    private String transactionReference;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private TransactionType type;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TransactionStatus status;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Size(max = 50)
    @Column(name = "gateway_response_code", length = 50)
    private String gatewayResponseCode;

    @Size(max = 255)
    @Column(name = "gateway_response_message", length = 255)
    private String gatewayResponseMessage;
}
