package com.logic.report_central.entities;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.logic.report_central.enums.Gender;
import com.logic.report_central.enums.StatusEnum;
import com.logic.report_central.serializers.StatusEnumSerializer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Table(name = "reports")
@Entity

@Getter
@Setter
public class Report {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)")
    @JsonSerialize(using = StatusEnumSerializer.class)
    @JsonAlias("active")
    private StatusEnum status;

    @Column(name = "pacient_name", length = 50, nullable = false)
    private String pacientName;

    @Column(name = "pacient_gender", columnDefinition = "CHAR(1)", nullable = false)
    private Gender pacientGender;

    @Column(name = "pacient_birth_date", nullable = false)
    private Date pacientBirthDate;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToOne
    @JoinColumn(name = "id_doctor_request")
    private Doctor doctorRequest;

    @ManyToOne
    @JoinColumn(name = "id_doctor_execute")
    private Doctor doctorExecute;

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
