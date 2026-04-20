package com.gharwale.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Listing")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "listingId")
    private Integer listingId;

    @Column(name = "propertyId", nullable = false)
    private Integer propertyId;

    @Column(name = "unitNumber", nullable = false, length = 20)
    private String unitNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumns({
        @JoinColumn(name = "propertyId", referencedColumnName = "propertyId", insertable = false, updatable = false),
        @JoinColumn(name = "unitNumber",  referencedColumnName = "unitNumber",  insertable = false, updatable = false)
    })
    private UnitDetails unit;

    @Column(name = "ownerId", nullable = false)
    private Integer ownerId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ownerId", insertable = false, updatable = false)
    private Person owner;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ListingStatus status = ListingStatus.Open;
}
