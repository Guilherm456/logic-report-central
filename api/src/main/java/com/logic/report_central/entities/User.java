package com.logic.report_central.entities;

import com.logic.report_central.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "users")
@Entity
public class User {

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)")
    private StatusEnum status;

    @Column(columnDefinition = "VARCHAR(50)")
    private String email;
    private String password;

    @Column(columnDefinition = "VARCHAR(50)")
    private String username;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true)
    private Long id;

    @UuidGenerator
    @Column(name = "uuid", unique = true, updatable = false)
    private UUID uuid;

    @Column(name="created_at",  updatable = false)
    @CreatedDate
    private Date createdAt;

    @Column(name="updated_at")
    @LastModifiedDate
    private Date updatedAt;




}
