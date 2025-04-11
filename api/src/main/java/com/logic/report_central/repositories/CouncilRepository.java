package com.logic.report_central.repositories;

import com.logic.report_central.entities.Council;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CouncilRepository extends JpaRepository<Council, Long> {

    Optional<Council> findByName(String name);

    Page<Council> findByNameContainingIgnoreCase(String name, Pageable pageable);



}
