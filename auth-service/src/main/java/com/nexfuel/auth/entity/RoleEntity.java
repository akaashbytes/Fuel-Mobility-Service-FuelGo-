package com.nexfuel.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ROLES")
@Getter
@Setter
@NoArgsConstructor
public class RoleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_roles")
    @SequenceGenerator(name = "seq_roles", sequenceName = "SEQ_ROLES", allocationSize = 1)
    private Long id;

    @NotBlank(message = "Role name is required")
    @Size(max = 50, message = "Role name cannot exceed 50 characters")
    @Column(name = "NAME", nullable = false, unique = true, length = 50)
    private String name;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    @Column(name = "DESCRIPTION", length = 255)
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "ROLE_PERMISSIONS",
        joinColumns = @JoinColumn(name = "ROLE_ID"),
        inverseJoinColumns = @JoinColumn(name = "PERMISSION_ID")
    )
    private Set<PermissionEntity> permissions = new HashSet<>();
}
