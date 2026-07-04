package com.shopease.dto.response;

import lombok.*;

@Data @Builder
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String role;
}
