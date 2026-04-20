package com.gharwale.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "SaleDeal")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SaleDeal {

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

    @Column(name = "salePrice", nullable = false, precision = 15, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "buyerId", nullable = false)
    private Integer buyerId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "buyerId", insertable = false, updatable = false)
    private Person buyer;
}
