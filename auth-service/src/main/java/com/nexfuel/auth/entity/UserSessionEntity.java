package com.nexfuel.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "USER_SESSIONS")
@Getter
@Setter
@NoArgsConstructor
public class UserSessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_user_sessions")
    @SequenceGenerator(name = "seq_user_sessions", sequenceName = "SEQ_USER_SESSIONS", allocationSize = 1)
    private Long id;

    @NotNull(message = "User association is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private UserEntity user;

    @NotBlank(message = "Session token is required")
    @Size(max = 500, message = "Token cannot exceed 500 characters")
    @Column(name = "TOKEN", nullable = false, length = 500)
    private String token;

    @NotNull(message = "Session expiration time is required")
    @Column(name = "EXPIRED_AT", nullable = false)
    private LocalDateTime expiredAt;

    @NotBlank(message = "Session status is required")
    @Size(max = 20, message = "Status cannot exceed 20 characters")
    @Column(name = "STATUS", nullable = false, length = 20)
    private String status = "ACTIVE";

    @Size(max = 45, message = "IP Address cannot exceed 45 characters")
    @Column(name = "IP_ADDRESS", length = 45)
    private String ipAddress;

    @Size(max = 255, message = "Device info cannot exceed 255 characters")
    @Column(name = "DEVICE_INFO", length = 255)
    private String deviceInfo;

    @NotNull(message = "Session creation time is required")
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
