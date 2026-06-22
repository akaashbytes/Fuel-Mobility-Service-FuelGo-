package com.nexfuel.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public final class ClientDtos {

    private ClientDtos() {}

    // ==========================================
    // auth-service DTOs
    // ==========================================
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserProfileResponse {
        private Long id;
        private String fullName;
        private String email;
        private String phoneNumber;
        private String status;
        private Set<String> roles;
        private Set<String> permissions;
    }

    // ==========================================
    // customer-service DTOs
    // ==========================================
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CustomerDashboardResponse {
        private CustomerProfileResponse profile;
        private List<VehicleResponse> vehicles;
        private int totalVehiclesCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CustomerProfileResponse {
        private Long id;
        private Long userId;
        private double rating;
        private String defaultAddress;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VehicleResponse {
        private Long id;
        private String make;
        private String model;
        private int year;
        private String color;
        private String licensePlate;
    }

    // ==========================================
    // provider-service DTOs
    // ==========================================
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProviderDashboardResponse {
        private ProviderProfileResponse profile;
        private ProviderAvailabilityResponse currentAvailability;
        private ProviderEarningsResponse earnings;
        private long totalDocuments;
        private long approvedDocuments;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProviderProfileResponse {
        private Long id;
        private Long userId;
        private ProviderStatus status;
        private double rating;
        private int completedDeliveries;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProviderProfileRequest {
        private ProviderStatus status;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProviderAvailabilityResponse {
        private Long id;
        private Long providerId;
        private String status; // AvailabilityStatus (AVAILABLE, UNAVAILABLE, ON_JOB)
        private LocalDateTime lastActiveAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProviderEarningsResponse {
        private Long id;
        private Long providerId;
        private BigDecimal grossAmount;
        private BigDecimal paidAmount;
        private BigDecimal pendingAmount;
        private LocalDateTime lastUpdatedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProviderDocumentResponse {
        private Long id;
        private Long providerId;
        private String docType;
        private String docName;
        private String fileUrl;
        private String status; // DocumentStatus (PENDING, APPROVED, REJECTED)
        private LocalDate expiresAt;
    }

    // ==========================================
    // collaborator-service DTOs
    // ==========================================
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CollaboratorDashboardResponse {
        private long totalCollaborators;
        private long activePartners;
        private long totalServiceAreas;
        private List<CollaboratorResponse> collaborators;
        private List<ServiceAreaResponse> serviceAreas;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CollaboratorResponse {
        private Long id;
        private String name;
        private String contactPerson;
        private String email;
        private String phoneNumber;
        private String address;
        private CollaboratorStatus status;
        private LocalDate contractExpiryDate;
        private String notes;
        private Double latitude;
        private Double longitude;
        private List<Long> serviceAreaIds;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CollaboratorRequest {
        private String name;
        private String contactPerson;
        private String email;
        private String phoneNumber;
        private String address;
        private CollaboratorStatus status;
        private LocalDate contractExpiryDate;
        private String notes;
        private Double latitude;
        private Double longitude;
        private List<Long> serviceAreaIds;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ServiceAreaResponse {
        private Long id;
        private String city;
        private String name;
        private ServiceAreaStatus status;
        private String polygonCoords;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CollaboratorFuelPricingResponse {
        private Long id;
        private Long collaboratorId;
        private String fuelType;
        private BigDecimal pricePerGallon;
        private LocalDateTime lastUpdatedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CollaboratorFuelPricingRequest {
        private String fuelType;
        private BigDecimal pricePerGallon;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ServiceAreaRequest {
        private String city;
        private String name;
        private ServiceAreaStatus status;
        private String polygonCoords;
    }

    // ==========================================
    // order-service DTOs
    // ==========================================
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderDashboardResponse {
        private long totalOrders;
        private long pendingOrders;
        private long activeOrders;
        private long completedOrders;
        private long cancelledOrders;
        private List<OrderResponse> orders;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderResponse {
        private Long id;
        private Long customerId;
        private Long vehicleId;
        private Long providerId;
        private OrderState status;
        private String fuelType;
        private BigDecimal quantityGallons;
        private BigDecimal deliveryCharge;
        private BigDecimal fuelCost;
        private BigDecimal totalAmount;
        private Double targetLatitude;
        private Double targetLongitude;
        private String targetAddress;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderStatusUpdateRequest {
        private OrderState status;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderAssignmentRequest {
        private Long providerId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ServicePackageResponse {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private String status;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ServicePackageRequest {
        private String name;
        private String description;
        private BigDecimal price;
        private String status;
    }

    // ==========================================
    // payment-service DTOs
    // ==========================================
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaymentDashboardResponse {
        private BigDecimal totalRevenue;
        private BigDecimal companyCommissions;
        private BigDecimal providerPayouts;
        private Long activeInvoicesCount;
        private BigDecimal ledgerDebitSum;
        private BigDecimal ledgerCreditSum;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaymentResponse {
        private Long id;
        private Long invoiceId;
        private Long orderId;
        private BigDecimal amount;
        private String status; // PaymentStatus
        private String paymentMethod;
        private String paymentGateway;
        private String gatewayPaymentId;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InvoiceResponse {
        private Long id;
        private Long orderId;
        private String invoiceNumber;
        private BigDecimal amount;
        private BigDecimal tax;
        private BigDecimal totalAmount;
        private String status; // InvoiceStatus
        private LocalDateTime dueDate;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProviderSettlementResponse {
        private Long id;
        private Long paymentId;
        private Long providerId;
        private BigDecimal grossAmount;
        private BigDecimal commissionAmount;
        private BigDecimal settlementAmount;
        private String status; // SettlementStatus
        private LocalDateTime settledAt;
        private LocalDateTime createdAt;
    }

    // ==========================================
    // feedback-service DTOs
    // ==========================================
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminFeedbackDashboard {
        private Long totalFeedbackCount;
        private Double averageSystemRating;
        private Long pendingResponsesCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FeedbackResponse {
        private Long id;
        private Long orderId;
        private Long customerId;
        private Long providerId;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FeedbackDetailResponse {
        private Long id;
        private Long orderId;
        private Long customerId;
        private Long providerId;
        private Integer rating;
        private String comment;
        private List<FeedbackResponseDto> responses;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FeedbackResponseDto {
        private Long id;
        private Long adminId;
        private String responseComment;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProviderRatingSummary {
        private Long providerId;
        private Double averageRating;
        private Long totalReviews;
    }

    // ==========================================
    // tracking-service DTOs
    // ==========================================
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TrackingDashboardResponse {
        private Long totalActiveProviders;
        private Long totalEnRouteOrders;
        private Double averageEtaMinutes;
        private Long unreadNotificationsCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProviderLocationResponse {
        private Long providerId;
        private Double latitude;
        private Double longitude;
        private String status;
        private LocalDateTime lastUpdated;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderTrackingResponse {
        private Long orderId;
        private Long providerId;
        private Long customerId;
        private String status;
        private Integer etaMinutes;
        private Double distanceKm;
        private List<LocationHistory> locationTimeline;
        private LocalDateTime lastUpdated;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LocationHistory {
        private Double latitude;
        private Double longitude;
        private LocalDateTime timestamp;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NotificationResponse {
        private String id;
        private Long userId;
        private String userRole;
        private String title;
        private String message;
        private Boolean read;
        private LocalDateTime createdAt;
    }

    // ==========================================
    // analytics-service DTOs
    // ==========================================
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnalyticsDashboardResponse {
        private LocalDate snapshotDate;
        private BigDecimal totalRevenue;
        private Long totalOrders;
        private Double averageRating;
        private Long activeProviders;
        private Long activeCustomers;
        private List<RecentActivityLog> recentActivityLogs;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentActivityLog {
        private String id;
        private Long userId;
        private String userRole;
        private String activityType;
        private String description;
        private LocalDateTime timestamp;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RevenueAnalyticsResponse {
        private String snapshotType;
        private BigDecimal totalRevenue;
        private BigDecimal growthPercentage;
        private BigDecimal avgOrderValue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProviderAnalyticsResponse {
        private long totalProvidersCount;
        private double overallAverageRating;
        private List<ProviderScore> topProviders;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProviderScore {
        private Long providerId;
        private double averageRating;
        private int completedOrders;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderAnalyticsResponse {
        private long totalOrders;
        private long completedOrders;
        private long cancelledOrders;
        private double completionRate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CustomerAnalyticsResponse {
        private long totalCustomers;
        private long newCustomersCount;
        private double averageOrderFrequency;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CollaboratorAnalyticsResponse {
        private long totalBunksCount;
        private BigDecimal minFuelPrice;
        private BigDecimal maxFuelPrice;
        private BigDecimal avgFuelPrice;
    }
}
