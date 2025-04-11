package com.logic.report_central.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.logic.report_central.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "users")
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true)
    @JsonIgnore
    private Long id;

    @UuidGenerator
    @Column(name = "uuid", unique = true, updatable = false)
    @JsonProperty("id")
    private UUID uuid;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)")
    private StatusEnum status;

    @Column(length = 50, unique = true)
    private String email;

    @JsonIgnore
    private String password;

    @Column(length = 50)
    private String username;

    @Column(name = "created_at", updatable = false)
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @PrePersist
    private void onCreate() {
        this.createdAt = new Date();
        this.updatedAt = new Date();

        this.status = StatusEnum.A;
    }

    @PreUpdate
    private void onUpdate() {
        this.updatedAt = new Date();
    }
}
