package com.nexfuel.admin.controller;

import com.nexfuel.admin.entity.AdminNotificationEntity;
import com.nexfuel.admin.service.AdminNotificationService;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/notifications")
@RequiredArgsConstructor
@Tag(name = "Admin Notifications Alert Center", description = "Admin only. Exposes system events, dispatcher alerts, and provider verification logs.")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminNotificationController {

    private final AdminNotificationService adminNotificationService;

    @GetMapping
    @Operation(summary = "Get system notifications", description = "Lists administrative notifications sorted by date.")
    public ResponseEntity<ApiResponse<List<AdminNotificationEntity>>> getNotifications() {
        List<AdminNotificationEntity> list = adminNotificationService.getAllNotifications();
        return ResponseEntity.ok(ApiResponse.success("Admin notifications list retrieved successfully.", list));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark alert notification as read", description = "Flags readStatus boolean to true.")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable("id") Long id) {
        adminNotificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Admin notification marked as read successfully."));
    }

    @PostMapping
    @Operation(summary = "Broadcast administrative notification", description = "Creates a new system-wide alert.")
    public ResponseEntity<ApiResponse<AdminNotificationEntity>> createNotification(
            @RequestParam("title") String title,
            @RequestParam("message") String message,
            @RequestParam(value = "type", defaultValue = "SYSTEM") String type) {
        AdminNotificationEntity entity = adminNotificationService.createNotification(title, message, type);
        return ResponseEntity.ok(ApiResponse.success("Notification broadcasted successfully.", entity));
    }
}
