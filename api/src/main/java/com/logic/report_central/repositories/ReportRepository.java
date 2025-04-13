package com.logic.report_central.repositories;

import com.logic.report_central.entities.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends JpaRepository<Report, Long> {


    @Query("""
            SELECT r FROM Report r
            WHERE LOWER(r.pacientName) LIKE %:searchTerm%
            OR LOWER(r.content) LIKE %:searchTerm%
            OR LOWER(r.doctorRequest.name) LIKE %:searchTerm%
            OR LOWER(r.doctorExecute.name) LIKE %:searchTerm%
            """)
    Page<Report> findAllBySearch(@Param("searchTerm") String searchTerm, Pageable pageable);


}
