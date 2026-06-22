package com.nexfuel.tracking.config;

import com.nexfuel.shared.constant.SecurityConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class HeaderAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String userIdHeader = request.getHeader(SecurityConstants.HEADER_USER_ID);
        String rolesHeader = request.getHeader(SecurityConstants.HEADER_USER_ROLES);

        if (StringUtils.hasText(userIdHeader)) {
            try {
                Long userId = Long.valueOf(userIdHeader);
                
                List<SimpleGrantedAuthority> authorities = Collections.emptyList();
                if (StringUtils.hasText(rolesHeader)) {
                    authorities = Arrays.stream(rolesHeader.split(","))
                            .filter(StringUtils::hasText)
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());
                }

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userId, null, authorities
                );
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);

                // Expose userId as request attribute for easier controller mapping
                request.setAttribute(SecurityConstants.HEADER_USER_ID, userId);
                
            } catch (NumberFormatException ex) {
                // Clear security context on malformed ID
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
