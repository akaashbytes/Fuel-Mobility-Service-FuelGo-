package com.nexfuel.gateway.filter;

import com.nexfuel.shared.constant.SecurityConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter implements WebFilter {

    private final SecretKey key;

    public JwtAuthenticationFilter(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = resolveToken(exchange.getRequest());

        if (token == null) {
            return chain.filter(exchange);
        }

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String userId = claims.getSubject();
            String email = claims.get("email", String.class);
            
            // Extract roles and permissions from claims list
            @SuppressWarnings("unchecked")
            List<String> roles = claims.get("roles", List.class);
            if (roles == null) roles = Collections.emptyList();

            @SuppressWarnings("unchecked")
            List<String> permissions = claims.get("permissions", List.class);
            if (permissions == null) permissions = Collections.emptyList();

            // Construct new request with claims propagated as headers
            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                    .header(SecurityConstants.HEADER_USER_ID, userId)
                    .header(SecurityConstants.HEADER_USER_EMAIL, email)
                    .header(SecurityConstants.HEADER_USER_ROLES, String.join(",", roles))
                    .header(SecurityConstants.HEADER_USER_PERMISSIONS, String.join(",", permissions))
                    .build();

            ServerWebExchange mutatedExchange = exchange.mutate().request(mutatedRequest).build();

            // Build Security Authorities (roles and permissions combined)
            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
            permissions.stream()
                    .map(SimpleGrantedAuthority::new)
                    .forEach(authorities::add);

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    userId, null, authorities
            );

            return chain.filter(mutatedExchange)
                    .contextWrite(ReactiveSecurityContextHolder.withSecurityContext(
                            Mono.just(new SecurityContextImpl(auth))
                    ));

        } catch (Exception ex) {
            // Token validation failed (expired, malformed signature, etc.)
            return chain.filter(exchange);
        }
    }

    private String resolveToken(ServerHttpRequest request) {
        String bearerToken = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(SecurityConstants.BEARER_PREFIX)) {
            return bearerToken.substring(SecurityConstants.BEARER_PREFIX.length());
        }
        return null;
    }
}
