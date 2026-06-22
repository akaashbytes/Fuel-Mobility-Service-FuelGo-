package com.nexfuel.order.dto;

import com.nexfuel.order.entity.OrderState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
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
