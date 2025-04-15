package com.logic.report_central.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.logic.report_central.models.enums.DoctorTypeEnum;
import com.logic.report_central.models.enums.StatusEnum;
import com.logic.report_central.models.serializers.StatusEnumSerializer;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Table(name = "doctors")
@Entity

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)")
    @JsonSerialize(using = StatusEnumSerializer.class)
    @JsonProperty("active")
    private StatusEnum status;

    @NonNull
    @Column(length = 50, nullable = false)
    private String name;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)", nullable = false)
    private DoctorTypeEnum type;

    @NonNull
    @ManyToOne()
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnoreProperties("doctor_linked")
    private User user;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "council_id", referencedColumnName = "id")
    private Council council;

    @NonNull
    @Column(name = "council_number", nullable = false, length = 20)
    private String councilNumber;

    @NonNull
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
