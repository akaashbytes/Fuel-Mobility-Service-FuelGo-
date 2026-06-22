package com.nexfuel.admin.service.impl;

import com.nexfuel.admin.entity.SystemConfigurationEntity;
import com.nexfuel.admin.entity.AdminActionLogEntity;
import com.nexfuel.admin.repository.SystemConfigurationRepository;
import com.nexfuel.admin.repository.AdminActionLogRepository;
import com.nexfuel.admin.service.SystemConfigurationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SystemConfigurationServiceImpl implements SystemConfigurationService {

    private final SystemConfigurationRepository systemConfigurationRepository;
    private final AdminActionLogRepository adminActionLogRepository;

    @Override
    @Transactional
    public SystemConfigurationEntity saveConfiguration(String key, String value, String description, Long adminId) {
        log.info("Admin {} updating configuration parameter key {} to value {}", adminId, key, value);

        SystemConfigurationEntity config = systemConfigurationRepository.findByConfigKey(key)
                .orElse(new SystemConfigurationEntity());

        config.setConfigKey(key);
        config.setConfigValue(value);
        if (description != null) {
            config.setDescription(description);
        }

        SystemConfigurationEntity savedConfig = systemConfigurationRepository.save(config);

        // Audit log action
        AdminActionLogEntity actionLog = new AdminActionLogEntity();
        actionLog.setAdminId(adminId);
        actionLog.setActionType("SYSTEM_CONFIGURATION_CHANGE");
        actionLog.setDetails("Updated configuration key: " + key + " to value: " + value);
        adminActionLogRepository.save(actionLog);

        return savedConfig;
    }

    @Override
    @Transactional(readOnly = true)
    public String getConfigurationValue(String key) {
        return systemConfigurationRepository.findByConfigKey(key)
                .map(SystemConfigurationEntity::getConfigValue)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemConfigurationEntity> getAllConfigurations() {
        return systemConfigurationRepository.findAll();
    }
}
