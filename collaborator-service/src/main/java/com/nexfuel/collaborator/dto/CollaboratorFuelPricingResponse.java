package com.nexfuel.collaborator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollaboratorFuelPricingResponse {
    private Long id;
    private Long collaboratorId;
    private String fuelType;
    private BigDecimal price;
    private LocalDateTime lastUpdatedAt;
}
