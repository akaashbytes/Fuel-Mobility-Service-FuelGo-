package com.nexfuel.analytics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerAnalyticsResponse {
    private Long activeCustomers;
    private Long newRegistrations;
    private Double averageOrdersPerCustomer;
}
