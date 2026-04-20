package com.gharwale.service;

import com.gharwale.dto.AgentPerformanceDTO;
import com.gharwale.dto.DashboardSummaryDTO;
import com.gharwale.entity.AgentStatus;
import com.gharwale.entity.ListingStatus;
import com.gharwale.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final AgentRepository agentRepo;
    private final ListingRepository listingRepo;
    private final SaleDealRepository saleRepo;
    private final RentalDealRepository rentalRepo;

    public DashboardSummaryDTO getSummary() {
        long totalAgents   = agentRepo.count();
        long activeAgents  = agentRepo.findByAgentStatus(AgentStatus.Active).size();
        long totalListings = listingRepo.count();
        long openListings  = listingRepo.findByStatus(ListingStatus.Open).size();
        long totalSales    = saleRepo.count();
        long totalRentals  = rentalRepo.count();
        BigDecimal saleRev   = saleRepo.totalRevenue();
        BigDecimal rentalRev = rentalRepo.totalRevenue();

        return DashboardSummaryDTO.builder()
                .totalAgents(totalAgents)
                .activeAgents(activeAgents)
                .totalListings(totalListings)
                .openListings(openListings)
                .totalSales(totalSales)
                .totalRentals(totalRentals)
                .totalSaleRevenue(saleRev)
                .totalRentalRevenue(rentalRev)
                .build();
    }

    public List<AgentPerformanceDTO> getAgentPerformance() {
        return agentRepo.findAll().stream().map(a -> {
            long sales   = saleRepo.countByAgentId(a.getAgentId());
            long rentals = rentalRepo.countByAgentId(a.getAgentId());
            BigDecimal rev = saleRepo.findByAgentId(a.getAgentId())
                    .stream().map(s -> s.getSalePrice()).reduce(BigDecimal.ZERO, BigDecimal::add)
                    .add(rentalRepo.findByAgentId(a.getAgentId())
                    .stream().map(r -> r.getRentPrice()).reduce(BigDecimal.ZERO, BigDecimal::add));

            return AgentPerformanceDTO.builder()
                    .agentId(a.getAgentId())
                    .agentName(a.getPerson().getFirstName() + " " +
                            (a.getPerson().getLastName() != null ? a.getPerson().getLastName() : ""))
                    .agentStatus(a.getAgentStatus().name())
                    .salesCount(sales)
                    .rentalsCount(rentals)
                    .totalDeals(sales + rentals)
                    .totalRevenue(rev)
                    .build();
        }).collect(Collectors.toList());
    }
}
