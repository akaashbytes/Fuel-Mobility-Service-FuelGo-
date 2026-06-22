package com.nexfuel.auth.entity;

import com.nexfuel.shared.enums.OtpType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "OTP_VERIFICATIONS")
@Getter
@Setter
@NoArgsConstructor
public class OtpVerificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_otp_verifications")
    @SequenceGenerator(name = "seq_otp_verifications", sequenceName = "SEQ_OTP_VERIFICATIONS", allocationSize = 1)
    private Long id;

    @NotNull(message = "User association is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private UserEntity user;

    @NotBlank(message = "OTP code is required")
    @Size(max = 10, message = "OTP code cannot exceed 10 characters")
    @Column(name = "OTP_CODE", nullable = false, length = 10)
    private String otpCode;

    @NotNull(message = "Verification type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "VERIFY_TYPE", nullable = false, length = 20)
    private OtpType verifyType;

    @NotNull(message = "Expiration time is required")
    @Column(name = "EXPIRED_AT", nullable = false)
    private LocalDateTime expiredAt;

    @Column(nullable = false)
    private int attempts = 0;

    @NotBlank(message = "Status is required")
    @Size(max = 20, message = "Status cannot exceed 20 characters")
    @Column(name = "STATUS", nullable = false, length = 20)
    private String status = "PENDING";

    @NotNull(message = "Creation time is required")
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
