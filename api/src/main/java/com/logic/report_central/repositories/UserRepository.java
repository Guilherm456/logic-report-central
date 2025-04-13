package com.logic.report_central.repositories;

import com.logic.report_central.entities.User;
import com.logic.report_central.enums.StatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    User findByEmail(String email);

    Optional<User> findByIdAndStatusNot(Long id, StatusEnum status);
}