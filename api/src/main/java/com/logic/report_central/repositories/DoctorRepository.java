package com.logic.report_central.repositories;

import com.logic.report_central.models.entities.Doctor;
import com.logic.report_central.models.enums.StatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long>, JpaSpecificationExecutor<Doctor> {

    Optional<Doctor> findByIdAndStatusNot(Long id, StatusEnum status);

    Optional<Doctor> findByUserId(Long userId);

    boolean existsByCouncilIdAndCouncilNumberAndStateIdAndStatusNot(Long councilId, String councilNumber, Long stateId, StatusEnum status);

    Optional<Doctor> findByCouncilIdAndCouncilNumberAndStateIdAndStatusNot(Long councilId, String councilNumber, Long stateId, StatusEnum status);


}
