package com.logic.report_central.repositories;

import com.logic.report_central.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE (LOWER(u.username) LIKE %:searchTerm% OR LOWER(u.email) LIKE %:searchTerm%) AND u.status <> 'D'")
    Page<User> findByUsernameOrEmailContainingIgnoreCase(@Param("searchTerm") String searchTerm,  Pageable pageable);

    @Override
    @NonNull
    @Query("SELECT u FROM User u WHERE u.status <> 'D'")
    Page<User> findAll(@NonNull Pageable pageable);


}