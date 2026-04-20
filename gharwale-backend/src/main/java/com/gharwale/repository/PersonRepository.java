package com.gharwale.repository;

import com.gharwale.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Integer> {
    Optional<Person> findByEmail(String email);
    Optional<Person> findByPhoneNo(String phoneNo);
    boolean existsByEmail(String email);
    boolean existsByPhoneNo(String phoneNo);
}
