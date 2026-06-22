package com.nexfuel.admin.service.impl;

import com.nexfuel.admin.entity.AdminActionLogEntity;
import com.nexfuel.admin.repository.AdminActionLogRepository;
import com.nexfuel.admin.service.AdminActionLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminActionLogServiceImpl implements AdminActionLogService {

    private final AdminActionLogRepository adminActionLogRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AdminActionLogEntity> getAllActionLogs() {
        return adminActionLogRepository.findAllByOrderByCreatedAtDesc();
    }
}
