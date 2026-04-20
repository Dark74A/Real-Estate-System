package com.gharwale.dto;

import lombok.*;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class LoginResponse {
    private String role;
    private Integer id;
    private String name;
    private String email;
}
