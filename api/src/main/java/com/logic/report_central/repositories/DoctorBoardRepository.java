package com.logic.report_central.repositories;

import com.logic.report_central.entities.DoctorBoard;
import com.logic.report_central.enums.CouncilEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorBoardRepository extends JpaRepository<DoctorBoard, Long> {

    Optional<DoctorBoard> findByCouncilTypeAndCouncilNumberAndState_Uf(CouncilEnum councilType, String councilNumber, String stateUf);
}