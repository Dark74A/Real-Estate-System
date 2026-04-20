package com.gharwale.dto;

import lombok.*;
import java.time.LocalDate;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class EmploymentHistoryDTO {
    private Integer agentId;
    private LocalDate dateOfJoining;
    private LocalDate dateOfLeaving;
    private String status;
}
