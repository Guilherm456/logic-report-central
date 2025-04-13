package com.logic.report_central.entities;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.logic.report_central.enums.Gender;
import com.logic.report_central.enums.StatusEnum;
import com.logic.report_central.serializers.StatusEnumSerializer;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Table(name = "reports")
@Entity

@Getter
@Setter

@RequiredArgsConstructor
@NoArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)")
    @JsonSerialize(using = StatusEnumSerializer.class)
    @JsonAlias("active")
    private StatusEnum status;

    @NonNull
    @Column(name = "pacient_name", length = 50, nullable = false)
    private String pacientName;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "pacient_gender", columnDefinition = "CHAR(1)", nullable = false)
    private Gender pacientGender;

    @NonNull
    @Column(name = "pacient_birth_date", nullable = false)
    private Date pacientBirthDate;

    @NonNull
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @NonNull
    @ManyToOne()
    @JoinColumn(name = "id_doctor_request")
    private Doctor doctorRequest;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "id_doctor", updatable = false)
    private Doctor doctor;

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
