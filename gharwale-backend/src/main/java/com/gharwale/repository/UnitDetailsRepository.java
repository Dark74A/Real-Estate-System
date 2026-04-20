package com.gharwale.repository;

import com.gharwale.entity.UnitDetails;
import com.gharwale.entity.UnitDetailsId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UnitDetailsRepository extends JpaRepository<UnitDetails, UnitDetailsId> {
    List<UnitDetails> findByPropertyId(Integer propertyId);
}
