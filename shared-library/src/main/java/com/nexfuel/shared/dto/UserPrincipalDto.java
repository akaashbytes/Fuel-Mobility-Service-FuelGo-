package com.nexfuel.shared.dto;

import java.util.Set;

public record UserPrincipalDto(
    Long id,
    String email,
    Set<String> roles,
    Set<String> permissions
) {}
