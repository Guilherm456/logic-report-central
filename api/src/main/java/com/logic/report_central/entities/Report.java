package com.logic.report_central.entities;

import com.logic.report_central.enums.Gender;
import com.logic.report_central.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.Date;
import java.util.UUID;

@Table(name = "reports")
@Entity

@Getter
@Setter
public class Report {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @UuidGenerator
    private UUID uuid;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "CHAR(1)")
    private StatusEnum status;

    @Column(name = "pacient_name", length = 50)
    private String pacientName;

    @Column(name = "pacient_gender", columnDefinition = "CHAR(1)")
    private Gender pacientGender;

    @Column(name = "pacient_birth_date")
    private Date pacientBirthDate;

    @Column(columnDefinition = "TEXT")
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
