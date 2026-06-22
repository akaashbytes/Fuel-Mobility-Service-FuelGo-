package com.nexfuel.gateway.config;

import com.nexfuel.gateway.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance()) // Stateless
                .exceptionHandling(exceptionHandlingSpec -> exceptionHandlingSpec
                        .authenticationEntryPoint((exchange, e) -> Mono.fromRunnable(() -> 
                                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED)
                        ))
                        .accessDeniedHandler((exchange, e) -> Mono.fromRunnable(() -> 
                                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN)
                        ))
                )
                .authorizeExchange(exchanges -> exchanges
                        // Public endpoints
                        .pathMatchers("/api/auth/register", "/api/auth/login", "/api/auth/refresh", "/api/auth/verify-otp").permitAll()
                        // Swagger docs
                        .pathMatchers("/swagger-ui/**", "/v3/api-docs/**", "/webjars/**").permitAll()
                        // Any other request must be authenticated
                        .anyExchange().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }
}
