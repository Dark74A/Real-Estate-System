package com.gharwale.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
public class AssignmentRequest {
    @NotNull private Integer agentId;
    @NotNull private Integer listingId;
}
