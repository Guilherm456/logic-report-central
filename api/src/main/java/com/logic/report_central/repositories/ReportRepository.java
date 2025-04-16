package com.logic.report_central.repositories;

import com.logic.report_central.models.entities.Report;
import com.logic.report_central.models.enums.StatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long>, JpaSpecificationExecutor<Report> {

    Optional<Report> findByIdAndStatusNot(Long id, StatusEnum status);


}
