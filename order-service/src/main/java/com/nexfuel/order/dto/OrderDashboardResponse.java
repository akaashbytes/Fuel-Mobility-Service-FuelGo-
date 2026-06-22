package com.nexfuel.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDashboardResponse {
    private long totalOrders;
    private long pendingOrders;
    private long activeOrders;
    private long completedOrders;
    private long cancelledOrders;
    private List<OrderResponse> orders;
}
