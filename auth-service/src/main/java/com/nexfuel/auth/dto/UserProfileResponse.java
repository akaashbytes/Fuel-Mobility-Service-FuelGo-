package com.nexfuel.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String status;
    private Set<String> roles;
    private Set<String> permissions;
}
