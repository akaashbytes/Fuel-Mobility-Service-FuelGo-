package com.nexfuel.shared.dto;

import java.util.Set;

public record UserSummaryDto(
    Long id,
    String fullName,
    String email,
    String phoneNumber,
    String status,
    Set<String> roles
) {}
