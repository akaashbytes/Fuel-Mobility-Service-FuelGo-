package com.nexfuel.auth.service;

import com.nexfuel.auth.config.JwtConfig;
import com.nexfuel.auth.entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JwtTokenService {

    private final JwtConfig jwtConfig;
    private final SecretKey key;

    public JwtTokenService(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
        this.key = Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(UserEntity user) {
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());

        List<String> permissions = user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(perm -> perm.getName())
                .distinct()
                .collect(Collectors.toList());

        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("email", user.getEmail())
                .claim("roles", roles)
                .claim("permissions", permissions)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtConfig.getAccessTokenExpirationMs()))
                .signWith(key)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = parseToken(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
