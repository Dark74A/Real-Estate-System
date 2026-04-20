package com.gharwale.entity;

import lombok.*;
import java.io.Serializable;

@Data @NoArgsConstructor @AllArgsConstructor
public class ListingDetailsId implements Serializable {
    private Integer listingId;
    private String listingType;
}
