package com.logic.report_central.repositories;

import com.logic.report_central.entities.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    boolean existsByUserId(Long userId);

    boolean existsByCouncilIdAndCouncilNumberAndStateId(Long councilId, String councilNumber, Long stateId);

    Optional<Doctor> findByCouncilIdAndCouncilNumberAndStateId(Long councilId, String councilNumber, Long stateId);


    @Query("SELECT d FROM Doctor d WHERE d.name LIKE %:searchTerm% OR d.councilNumber LIKE %:searchTerm% AND d.status <> 'D'")
    Page<Doctor> findByNameOrCouncilNumberContainingIgnoreCase(@Param("searchTerm") String search, Pageable pageable);


    @Override
    @NonNull
    @Query("SELECT d FROM Doctor d WHERE d.status <> 'D'")
    Page<Doctor> findAll(@NonNull Pageable pageable);
}