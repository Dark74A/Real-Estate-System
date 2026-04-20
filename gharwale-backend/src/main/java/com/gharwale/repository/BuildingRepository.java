package com.gharwale.repository;

import com.gharwale.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BuildingRepository extends JpaRepository<Building, Integer> {
    List<Building> findByCityContainingIgnoreCase(String city);
}
