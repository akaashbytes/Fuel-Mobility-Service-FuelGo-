package com.nexfuel.provider.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "BearerAuth";
        
        return new OpenAPI()
                .info(new Info()
                        .title("NexFuel Provider Microservice API")
                        .version("1.0.0")
                        .description("REST API documentation for the NexFuel Provider profiles, documents, availability, and earnings service.")
                        .contact(new Contact()
                                .name("NexFuel Dev Team")
                                .email("architecture@nexfuel.com")
                        )
                )
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Attach your JWT access token here. Although requests are parsed via HTTP headers from the API Gateway downstream, local developers can supply JWT values here for sandboxing.")
                        )
                );
    }
}
