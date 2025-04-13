package com.logic.report_central.entities;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.logic.report_central.enums.DoctorTypeEnum;
import com.logic.report_central.enums.StatusEnum;
import com.logic.report_central.serializers.StatusEnumSerializer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Table(name = "doctors")
@Entity

@Getter
@Setter
@NoArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)")
    @JsonSerialize(using = StatusEnumSerializer.class)
    @JsonAlias("active")
    private StatusEnum status;

    @Column(length = 50, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)", nullable = false)
    private DoctorTypeEnum type;

    @ManyToOne()
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "council_id", referencedColumnName = "id")
    private Council council;

    @Column(name = "council_number", nullable = false, length = 20)
    private String councilNumber;

    @ManyToOne
    @JoinColumn(name = "state_id", nullable = false)
    private States state;

    @Column(name = "created_at", updatable = false)
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @OneToMany(mappedBy = "doctorRequest",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonIgnore
    private List<Report> reportsRequest;

    @OneToMany(mappedBy = "doctor",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonIgnore
    private List<Report> reportsExecute;

    @OneToMany(mappedBy = "doctor")
    @JsonIgnore
    private List<Template> templates;

    public Doctor(String name, DoctorTypeEnum type, User user, Council council, String councilNumber, States state) {
        this.name = name;
        this.type = type;
        this.user = user;
        this.council = council;
        this.councilNumber = councilNumber;
        this.state = state;
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
