package com.nexfuel.tracking.service;

import com.nexfuel.tracking.document.NotificationDocument;
import com.nexfuel.tracking.dto.NotificationResponse;
import com.nexfuel.tracking.exception.NotificationNotFoundException;
import com.nexfuel.tracking.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public NotificationResponse createNotification(Long userId, String userRole, String title, String message) {
        NotificationDocument doc = new NotificationDocument();
        doc.setUserId(userId);
        doc.setUserRole(userRole.toUpperCase());
        doc.setTitle(title);
        doc.setMessage(message);
        doc.setRead(false);
        doc.setCreatedAt(LocalDateTime.now());

        NotificationDocument saved = notificationRepository.save(doc);
        return mapToResponse(saved);
    }

    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(String id) {
        NotificationDocument doc = notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with ID: " + id));
        doc.setRead(true);
        notificationRepository.save(doc);
    }

    public NotificationResponse mapToResponse(NotificationDocument doc) {
        return NotificationResponse.builder()
                .id(doc.getId())
                .userId(doc.getUserId())
                .userRole(doc.getUserRole())
                .title(doc.getTitle())
                .message(doc.getMessage())
                .read(doc.getRead())
                .createdAt(doc.getCreatedAt())
                .build();
    }
}
