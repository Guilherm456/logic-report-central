package com.logic.report_central.models.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.logic.report_central.models.enums.StatusEnum;
import com.logic.report_central.models.serializers.StatusEnumSerializer;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Table(name = "templates")
@Entity

@Getter
@Setter
@RequiredArgsConstructor
@NoArgsConstructor
public class Template {

    @Column(name = "created_at", updatable = false)
    Date createdAt;
    @Column(name = "updated_at")
    Date updatedAt;
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
    private String description;

    @NonNull
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "id_doctor", nullable = false)
    private Doctor doctor;

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
