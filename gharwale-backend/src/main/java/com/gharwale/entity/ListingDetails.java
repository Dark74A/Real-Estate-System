package com.gharwale.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "ListingDetails")
@IdClass(ListingDetailsId.class)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ListingDetails {

    @Id
    @Column(name = "listingId")
    private Integer listingId;

    @Id
    @Column(name = "listingType", length = 10)
    private String listingType;   // "SALE" or "RENT"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listingId", insertable = false, updatable = false)
    private Listing listing;

    @Column(name = "listingPrice", nullable = false, precision = 15, scale = 2)
    private BigDecimal listingPrice;

    @Column(name = "listingDate", nullable = false)
    private LocalDate listingDate;
}
