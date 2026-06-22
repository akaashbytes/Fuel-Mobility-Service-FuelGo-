package com.nexfuel.customer.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerProfileRequest {
    
    @Size(max = 255, message = "Default address cannot exceed 255 characters")
    private String defaultAddress;
}
