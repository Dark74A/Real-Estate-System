package com.gharwale.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class DashboardSummaryDTO {
    private long totalAgents;
    private long activeAgents;
    private long totalListings;
    private long openListings;
    private long totalSales;
    private long totalRentals;
    private BigDecimal totalSaleRevenue;
    private BigDecimal totalRentalRevenue;
}
