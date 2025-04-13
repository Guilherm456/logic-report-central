package com.logic.report_central.repositories;

import com.logic.report_central.models.entities.Template;
import com.logic.report_central.models.enums.StatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TemplateRepository extends JpaRepository<Template, Long> {

    @Query("""
            SELECT t FROM Template t
            WHERE t.doctor.id = :doctorId
            AND t.status <> 'D'
            AND (COALESCE(:searchTerm, '') = '' OR LOWER(t.description) LIKE %:searchTerm% OR LOWER(t.content) LIKE %:searchTerm%)
            AND t.status <> 'D'
            """)
    Page<Template> findActiveByDoctorIdAndOptionalSearchTerm(@Param("doctorId") Long doctorId, @Param("searchTerm") String searchTerm, Pageable pageable);

    Optional<Template> findByIdAndStatusNot(Long id, StatusEnum status);

}
