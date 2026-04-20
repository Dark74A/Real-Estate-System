package com.gharwale.entity;

import lombok.*;
import java.io.Serializable;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
public class EmploymentHistoryId implements Serializable {
    private Integer agentId;
    private LocalDate dateOfJoining;
}
