package com.gharwale.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor
public class AgentCreateRequest {
    @NotBlank private String firstName;
    private String middleName;
    private String lastName;

    @NotBlank @Pattern(regexp = "^[0-9]{10,15}$")
    private String phoneNo;

    @NotBlank @Email
    private String email;

    @NotBlank private String licenseNo;

    @NotNull @Positive
    private BigDecimal salary;

    @NotBlank @Pattern(regexp = "^[0-9]{12}$", message = "Aadhaar must be 12 digits")
    private String aadhaarNumber;
}
