package com.logic.report_central.entities;

import com.logic.report_central.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Table(name = "doctors")
@Entity

@Getter
@Setter
public class Doctor {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @UuidGenerator
    private UUID uuid;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "CHAR(1)")
    private StatusEnum status;

    @Column(name = "created_at", updatable = false)
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @OneToMany(mappedBy = "doctorRequest",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Report> reportsRequest;

    @OneToMany(mappedBy = "doctorExecute",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Report> reportsExecute;

    @OneToMany(mappedBy = "doctor",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<DoctorBoard> doctorBoards;


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
