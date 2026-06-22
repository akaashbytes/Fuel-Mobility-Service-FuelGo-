package com.nexfuel.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProfileResponse {
    private Long id;
    private Long userId;
    private double rating;
    private String defaultAddress;
}
