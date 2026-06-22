package com.nexfuel.admin.service.impl;

import com.nexfuel.admin.entity.AdminNotificationEntity;
import com.nexfuel.admin.repository.AdminNotificationRepository;
import com.nexfuel.admin.service.AdminNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminNotificationServiceImpl implements AdminNotificationService {

    private final AdminNotificationRepository adminNotificationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AdminNotificationEntity> getAllNotifications() {
        return adminNotificationRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public void markAsRead(Long id) {
        log.info("Marking admin notification ID {} as read", id);
        AdminNotificationEntity notification = adminNotificationRepository.findById(id)
                .orElseThrow(() -> new com.nexfuel.shared.exception.BaseException(
                        com.nexfuel.shared.exception.ErrorCode.RESOURCE_NOT_FOUND,
                        "Admin notification not found with ID " + id
                ));
        notification.setReadStatus(true);
        adminNotificationRepository.save(notification);
    }

    @Override
    @Transactional
    public AdminNotificationEntity createNotification(String title, String message, String type) {
        AdminNotificationEntity notification = new AdminNotificationEntity();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setNotificationType(type);
        notification.setReadStatus(false);
        return adminNotificationRepository.save(notification);
    }
}
