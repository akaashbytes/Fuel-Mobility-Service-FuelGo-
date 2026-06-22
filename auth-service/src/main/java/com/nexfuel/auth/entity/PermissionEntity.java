package com.nexfuel.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "PERMISSIONS")
@Getter
@Setter
@NoArgsConstructor
public class PermissionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_permissions")
    @SequenceGenerator(name = "seq_permissions", sequenceName = "SEQ_PERMISSIONS", allocationSize = 1)
    private Long id;

    @NotBlank(message = "Permission name is required")
    @Size(max = 100, message = "Permission name cannot exceed 100 characters")
    @Column(name = "NAME", nullable = false, unique = true, length = 100)
    private String name;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    @Column(name = "DESCRIPTION", length = 255)
    private String description;
}
