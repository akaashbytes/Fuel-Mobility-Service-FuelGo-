package com.nexfuel.auth.config;

import com.nexfuel.shared.constant.SecurityConstants;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.util.StringUtils;

public final class JwtUtils {

    private JwtUtils() {
        // Prevent instantiation
    }

    public static String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(SecurityConstants.BEARER_PREFIX)) {
            return bearerToken.substring(SecurityConstants.BEARER_PREFIX.length());
        }
        return null;
    }
}
