package com.nexfuel.admin.service;

import com.nexfuel.admin.entity.SystemConfigurationEntity;

import java.util.List;

public interface SystemConfigurationService {
    SystemConfigurationEntity saveConfiguration(String key, String value, String description, Long adminId);
    String getConfigurationValue(String key);
    List<SystemConfigurationEntity> getAllConfigurations();
}
