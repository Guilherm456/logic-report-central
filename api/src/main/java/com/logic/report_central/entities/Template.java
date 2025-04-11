package com.logic.report_central.entities;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.logic.report_central.enums.StatusEnum;
import com.logic.report_central.serializers.StatusEnumSerializer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Table(name = "templates")
@Entity

@Getter
@Setter
public class Template {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)")
    @JsonSerialize(using = StatusEnumSerializer.class)
    @JsonAlias("active")
    private StatusEnum status;

    @Column(length = 50, nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "created_at", updatable = false)
    Date createdAt;
    @Column(name = "updated_at")
    Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "id_doctor")
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
