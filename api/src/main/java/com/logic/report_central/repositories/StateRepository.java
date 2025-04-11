package com.logic.report_central.repositories;

import com.logic.report_central.entities.States;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StateRepository extends JpaRepository<States, Long> {

    
}
