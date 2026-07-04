package com.shopease.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.*;
import io.swagger.v3.oas.models.security.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("ShopEase API")
                .description("Full-stack e-commerce platform REST API")
                .version("1.0.0")
                .contact(new Contact().name("Shreya Jade").email("saj231004@gmail.com")))
            .addSecurityItem(new SecurityRequirement().addList("Bearer Auth"))
            .components(new io.swagger.v3.oas.models.Components()
                .addSecuritySchemes("Bearer Auth", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }
}
