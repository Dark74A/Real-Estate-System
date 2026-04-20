package com.gharwale.entity;

import lombok.*;
import java.io.Serializable;

@Data @NoArgsConstructor @AllArgsConstructor
public class AgentAssignmentId implements Serializable {
    private Integer agentId;
    private Integer listingId;
}
