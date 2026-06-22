package com.nexfuel.provider.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderDashboardResponse {
    private ProviderProfileResponse profile;
    private ProviderAvailabilityResponse currentAvailability;
    private ProviderEarningsResponse earnings;
    private long totalDocuments;
    private long approvedDocuments;
}
