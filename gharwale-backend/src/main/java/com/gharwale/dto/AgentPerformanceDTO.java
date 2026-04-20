package com.gharwale.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class AgentPerformanceDTO {
    private Integer agentId;
    private String agentName;
    private String agentStatus;
    private long salesCount;
    private long rentalsCount;
    private long totalDeals;
    private BigDecimal totalRevenue;
}
