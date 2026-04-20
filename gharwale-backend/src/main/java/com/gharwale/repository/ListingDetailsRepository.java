package com.gharwale.repository;

import com.gharwale.entity.ListingDetails;
import com.gharwale.entity.ListingDetailsId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ListingDetailsRepository extends JpaRepository<ListingDetails, ListingDetailsId> {
    List<ListingDetails> findByListingId(Integer listingId);
    Optional<ListingDetails> findByListingIdAndListingType(Integer listingId, String listingType);
}
