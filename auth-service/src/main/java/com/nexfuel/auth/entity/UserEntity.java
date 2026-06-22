package com.nexfuel.auth.entity;

import com.nexfuel.shared.enums.UserStatus;
import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "USERS")
@Getter
@Setter
@NoArgsConstructor
public class UserEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_users")
    @SequenceGenerator(name = "seq_users", sequenceName = "SEQ_USERS", allocationSize = 50)
    private Long id;

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    @Column(name = "FULL_NAME", nullable = false, length = 100)
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    @Column(name = "EMAIL", nullable = false, unique = true, length = 150)
    private String email;

    @Size(max = 30, message = "Phone number cannot exceed 30 characters")
    @Column(name = "PHONE_NUMBER", length = 30)
    private String phoneNumber;

    @NotBlank(message = "Password hash is required")
    @Size(max = 255, message = "Password hash cannot exceed 255 characters")
    @Column(name = "PASSWORD_HASH", nullable = false, length = 255)
    private String passwordHash;

    @NotNull(message = "User status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private UserStatus status = UserStatus.INACTIVE;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "USER_ROLES",
        joinColumns = @JoinColumn(name = "USER_ID"),
        inverseJoinColumns = @JoinColumn(name = "ROLE_ID")
    )
    private Set<RoleEntity> roles = new HashSet<>();
}
