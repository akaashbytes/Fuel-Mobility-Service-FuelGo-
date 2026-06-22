package com.nexfuel.admin.service.impl;

import com.nexfuel.admin.client.*;
import com.nexfuel.admin.dto.AdminDashboardResponse;
import com.nexfuel.admin.dto.AdminDashboardResponse.*;
import com.nexfuel.admin.dto.ClientDtos.*;
import com.nexfuel.admin.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final OrderServiceClient orderServiceClient;
    private final PaymentServiceClient paymentServiceClient;
    private final FeedbackServiceClient feedbackServiceClient;
    private final TrackingServiceClient trackingServiceClient;
    private final CollaboratorServiceClient collaboratorServiceClient;
    private final AnalyticsServiceClient analyticsServiceClient;

    @Override
    public AdminDashboardResponse getDashboardData() {
        log.info("Aggregating system-wide administrative dashboard telemetry");

        // 1. User Summary Aggregation
        UserCountSummary userSummary = UserCountSummary.builder()
                .totalCustomers(0L)
                .totalProviders(0L)
                .totalCollaborators(0L)
                .build();

        try {
            AnalyticsDashboardResponse analyticsDash = analyticsServiceClient.getDashboard().data();
            if (analyticsDash != null) {
                userSummary.setTotalCustomers(analyticsDash.getActiveCustomers() != null ? analyticsDash.getActiveCustomers() : 0L);
                userSummary.setTotalProviders(analyticsDash.getActiveProviders() != null ? analyticsDash.getActiveProviders() : 0L);
            }
        } catch (Exception ex) {
            log.error("Failed to query user statistics from analytics-service: {}", ex.getMessage());
        }

        try {
            CollaboratorDashboardResponse collabDash = collaboratorServiceClient.getDashboard().data();
            if (collabDash != null) {
                userSummary.setTotalCollaborators(collabDash.getTotalCollaborators());
            }
        } catch (Exception ex) {
            log.error("Failed to query bunk partner statistics from collaborator-service: {}", ex.getMessage());
        }

        // 2. Order Summary Aggregation
        OrderSummary orderSummary = OrderSummary.builder()
                .totalOrders(0L)
                .pendingOrders(0L)
                .activeOrders(0L)
                .completedOrders(0L)
                .cancelledOrders(0L)
                .build();

        try {
            OrderDashboardResponse orderDash = orderServiceClient.getDashboard().data();
            if (orderDash != null) {
                orderSummary.setTotalOrders(orderDash.getTotalOrders());
                orderSummary.setPendingOrders(orderDash.getPendingOrders());
                orderSummary.setActiveOrders(orderDash.getActiveOrders());
                orderSummary.setCompletedOrders(orderDash.getCompletedOrders());
                orderSummary.setCancelledOrders(orderDash.getCancelledOrders());
            }
        } catch (Exception ex) {
            log.error("Failed to query order lifecycle logs from order-service: {}", ex.getMessage());
        }

        // 3. Payment Summary Aggregation
        PaymentSummary paymentSummary = PaymentSummary.builder()
                .totalRevenue(BigDecimal.ZERO)
                .companyCommissions(BigDecimal.ZERO)
                .providerPayouts(BigDecimal.ZERO)
                .activeInvoicesCount(0L)
                .build();

        try {
            PaymentDashboardResponse paymentDash = paymentServiceClient.getDashboard().data();
            if (paymentDash != null) {
                paymentSummary.setTotalRevenue(paymentDash.getTotalRevenue() != null ? paymentDash.getTotalRevenue() : BigDecimal.ZERO);
                paymentSummary.setCompanyCommissions(paymentDash.getCompanyCommissions() != null ? paymentDash.getCompanyCommissions() : BigDecimal.ZERO);
                paymentSummary.setProviderPayouts(paymentDash.getProviderPayouts() != null ? paymentDash.getProviderPayouts() : BigDecimal.ZERO);
                paymentSummary.setActiveInvoicesCount(paymentDash.getActiveInvoicesCount() != null ? paymentDash.getActiveInvoicesCount() : 0L);
            }
        } catch (Exception ex) {
            log.error("Failed to query platform ledger stats from payment-service: {}", ex.getMessage());
        }

        // 4. Feedback Summary Aggregation
        FeedbackSummary feedbackSummary = FeedbackSummary.builder()
                .totalFeedbackCount(0L)
                .averageSystemRating(0.0)
                .pendingResponsesCount(0L)
                .build();

        try {
            AdminFeedbackDashboard feedbackDash = feedbackServiceClient.getDashboard().data();
            if (feedbackDash != null) {
                feedbackSummary.setTotalFeedbackCount(feedbackDash.getTotalFeedbackCount() != null ? feedbackDash.getTotalFeedbackCount() : 0L);
                feedbackSummary.setAverageSystemRating(feedbackDash.getAverageSystemRating() != null ? feedbackDash.getAverageSystemRating() : 0.0);
                feedbackSummary.setPendingResponsesCount(feedbackDash.getPendingResponsesCount() != null ? feedbackDash.getPendingResponsesCount() : 0L);
            }
        } catch (Exception ex) {
            log.error("Failed to query customer feedback reviews from feedback-service: {}", ex.getMessage());
        }

        // 5. Logistics/Tracking Summary Aggregation
        LogisticsSummary logisticsSummary = LogisticsSummary.builder()
                .totalActiveProviders(0L)
                .totalEnRouteOrders(0L)
                .averageEtaMinutes(0.0)
                .unreadNotificationsCount(0L)
                .build();

        try {
            TrackingDashboardResponse trackingDash = trackingServiceClient.getDashboard().data();
            if (trackingDash != null) {
                logisticsSummary.setTotalActiveProviders(trackingDash.getTotalActiveProviders() != null ? trackingDash.getTotalActiveProviders() : 0L);
                logisticsSummary.setTotalEnRouteOrders(trackingDash.getTotalEnRouteOrders() != null ? trackingDash.getTotalEnRouteOrders() : 0L);
                logisticsSummary.setAverageEtaMinutes(trackingDash.getAverageEtaMinutes() != null ? trackingDash.getAverageEtaMinutes() : 0.0);
                logisticsSummary.setUnreadNotificationsCount(trackingDash.getUnreadNotificationsCount() != null ? trackingDash.getUnreadNotificationsCount() : 0L);
            }
        } catch (Exception ex) {
            log.error("Failed to query logistics fleets coordinates from tracking-service: {}", ex.getMessage());
        }

        return AdminDashboardResponse.builder()
                .userSummary(userSummary)
                .orderSummary(orderSummary)
                .paymentSummary(paymentSummary)
                .feedbackSummary(feedbackSummary)
                .logisticsSummary(logisticsSummary)
                .build();
    }
}
