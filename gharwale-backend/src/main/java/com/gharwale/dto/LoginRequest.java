package com.gharwale.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String role;      // "ADMIN" or "AGENT"
    private String email;
    private String password;
}
