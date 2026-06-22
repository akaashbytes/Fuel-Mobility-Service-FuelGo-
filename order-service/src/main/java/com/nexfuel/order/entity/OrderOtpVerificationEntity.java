package com.nexfuel.order.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "ORDER_OTP_VERIFICATIONS")
@Getter
@Setter
@NoArgsConstructor
public class OrderOtpVerificationEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_order_otp")
    @SequenceGenerator(name = "seq_order_otp", sequenceName = "SEQ_OTP_VERIFICATIONS", allocationSize = 1)
    private Long id;

    @NotNull(message = "Order is required")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ORDER_ID", nullable = false, unique = true)
    private OrderEntity order;

    @NotBlank(message = "OTP code is required")
    @Size(max = 10)
    @Column(name = "OTP_CODE", nullable = false, length = 10)
    private String otpCode; // Hashed or plain

    @NotNull(message = "OTP status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private OtpStatus status = OtpStatus.PENDING;

    @NotNull(message = "Expiration timestamp is required")
    @Column(name = "EXPIRED_AT", nullable = false)
    private LocalDateTime expiredAt;
}
