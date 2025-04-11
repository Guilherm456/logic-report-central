package com.logic.report_central.repositories;

import com.logic.report_central.entities.User;
import com.logic.report_central.enums.StatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UsersRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    User findByEmail(String email);

    User findByUuid(UUID uuid);

    @Query("SELECT u FROM User u WHERE (LOWER(u.username) LIKE %:searchTerm% OR LOWER(u.email) LIKE %:searchTerm%) AND u.status <> :deletedStatus")
    Page<User> findByUsernameOrEmailContainingIgnoreCaseAndNotDeleted(@Param("searchTerm") String searchTerm, @Param("deletedStatus") StatusEnum deletedStatus, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.status <> :deletedStatus")
    Page<User> findAllNotDeleted(@Param("deletedStatus") StatusEnum deletedStatus, Pageable pageable);


}