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
@Table(name = "REFRESH_TOKENS")
@Getter
@Setter
@NoArgsConstructor
public class RefreshTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_refresh_tokens")
    @SequenceGenerator(name = "seq_refresh_tokens", sequenceName = "SEQ_REFRESH_TOKENS", allocationSize = 1)
    private Long id;

    @NotNull(message = "User association is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private UserEntity user;

    @NotBlank(message = "Token string is required")
    @Size(max = 255, message = "Token cannot exceed 255 characters")
    @Column(name = "TOKEN", nullable = false, unique = true, length = 255)
    private String token;

    @NotNull(message = "Expiry date is required")
    @Column(name = "EXPIRY_DATE", nullable = false)
    private LocalDateTime expiryDate;

    @Column(name = "REVOKED", nullable = false)
    private boolean revoked = false;

    @NotNull(message = "Creation time is required")
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
