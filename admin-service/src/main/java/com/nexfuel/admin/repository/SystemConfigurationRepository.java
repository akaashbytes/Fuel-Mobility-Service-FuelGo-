package com.nexfuel.admin.repository;

import com.nexfuel.admin.entity.SystemConfigurationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemConfigurationRepository extends JpaRepository<SystemConfigurationEntity, Long> {
    Optional<SystemConfigurationEntity> findByConfigKey(String configKey);
}
