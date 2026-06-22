package com.nexfuel.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private UserCountSummary userSummary;
    private OrderSummary orderSummary;
    private PaymentSummary paymentSummary;
    private FeedbackSummary feedbackSummary;
    private LogisticsSummary logisticsSummary;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserCountSummary {
        private long totalCustomers;
        private long totalProviders;
        private long totalCollaborators;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderSummary {
        private long totalOrders;
        private long pendingOrders;
        private long activeOrders;
        private long completedOrders;
        private long cancelledOrders;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentSummary {
        private BigDecimal totalRevenue;
        private BigDecimal companyCommissions;
        private BigDecimal providerPayouts;
        private Long activeInvoicesCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeedbackSummary {
        private Long totalFeedbackCount;
        private Double averageSystemRating;
        private Long pendingResponsesCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LogisticsSummary {
        private Long totalActiveProviders;
        private Long totalEnRouteOrders;
        private Double averageEtaMinutes;
        private Long unreadNotificationsCount;
    }
}
