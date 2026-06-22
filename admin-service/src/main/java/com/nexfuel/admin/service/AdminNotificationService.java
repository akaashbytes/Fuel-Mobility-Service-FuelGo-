package com.nexfuel.admin.service;

import com.nexfuel.admin.entity.AdminNotificationEntity;

import java.util.List;

public interface AdminNotificationService {
    List<AdminNotificationEntity> getAllNotifications();
    void markAsRead(Long id);
    AdminNotificationEntity createNotification(String title, String message, String type);
}
