package com.gharwale.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "RentalDeal")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RentalDeal {

    @Id
    @Column(name = "listingId")
    private Integer listingId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "listingId", insertable = false, updatable = false)
    private Listing listing;

    @Column(name = "agentId", nullable = false)
    private Integer agentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agentId", insertable = false, updatable = false)
    private Agent agent;

    @Column(name = "dateClosed", nullable = false)
    private LocalDate dateClosed;

    @Column(name = "rentPrice", nullable = false, precision = 12, scale = 2)
    private BigDecimal rentPrice;

    @Column(name = "tenantId", nullable = false)
    private Integer tenantId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tenantId", insertable = false, updatable = false)
    private Person tenant;
}
