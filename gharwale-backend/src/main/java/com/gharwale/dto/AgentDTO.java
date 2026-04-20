package com.gharwale.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class AgentDTO {
    private Integer agentId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String phoneNo;
    private String email;
    private String licenseNo;
    private String agentStatus;
    private BigDecimal salary;
    private String aadhaarNumber;
}
