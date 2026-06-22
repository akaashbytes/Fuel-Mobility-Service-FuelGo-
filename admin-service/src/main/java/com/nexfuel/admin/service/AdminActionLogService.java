package com.nexfuel.admin.service;

import com.nexfuel.admin.entity.AdminActionLogEntity;

import java.util.List;

public interface AdminActionLogService {
    List<AdminActionLogEntity> getAllActionLogs();
}
