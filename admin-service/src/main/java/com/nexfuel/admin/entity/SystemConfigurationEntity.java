package com.nexfuel.admin.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "SYSTEM_CONFIGURATIONS")
public class SystemConfigurationEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "system_configurations_gen")
    @SequenceGenerator(name = "system_configurations_gen", sequenceName = "system_configurations_seq", allocationSize = 1)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "config_key", nullable = false, unique = true, length = 100)
    private String configKey;

    @NotNull
    @Size(max = 500)
    @Column(name = "config_value", nullable = false, length = 500)
    private String configValue;

    @Size(max = 255)
    @Column(name = "description", length = 255)
    private String description;
}
