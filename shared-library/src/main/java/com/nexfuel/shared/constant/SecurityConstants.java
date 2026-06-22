package com.nexfuel.shared.constant;

public final class SecurityConstants {

    private SecurityConstants() {
        // Prevent instantiation
    }

    public static final String HEADER_USER_ID = "X-User-Id";
    public static final String HEADER_USER_EMAIL = "X-User-Email";
    public static final String HEADER_USER_ROLES = "X-User-Roles";
    public static final String HEADER_USER_PERMISSIONS = "X-User-Permissions";
    
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
}
