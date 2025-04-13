package com.logic.report_central.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.logic.report_central.models.enums.StatusEnum;
import com.logic.report_central.models.serializers.StatusEnumSerializer;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Table(name = "users")
@Entity

@Getter
@Setter
@RequiredArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)")
    @JsonSerialize(using = StatusEnumSerializer.class)
    @JsonProperty("active")
    private StatusEnum status;

    @NonNull
    @Column(length = 50, unique = true, nullable = false)
    private String email;

    @NonNull
    @JsonIgnore
    @Column(nullable = false, updatable = false)
    private String password;

    @NonNull
    @Column(length = 50, nullable = false)
    private String username;

    @Column(name = "created_at", updatable = false)
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Doctor> doctors;

    @JsonProperty("doctor_linked")
    public Optional<Doctor> doctorLinked() {
        if (this.doctors == null || this.doctors.isEmpty()) return Optional.empty();

        return this.doctors.stream()
                .filter(doctor -> doctor.getStatus() != StatusEnum.D)
                .findFirst();
    }


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
