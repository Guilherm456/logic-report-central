package com.logic.report_central.entities;

import com.logic.report_central.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.Date;
import java.util.UUID;

@Table(name = "templates")
@Entity

@Getter
@Setter
public class Template {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @UuidGenerator
    private UUID uuid;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)")
    private StatusEnum status;

    @Column(columnDefinition = "VARCHAR(50)")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name="created_at",  updatable = false)
    Date createdAt;

    @Column(name="updated_at")
    Date updatedAt;

    @PrePersist
    private void setCreatedAt() {
        this.createdAt = new Date();
    }

    @PreUpdate
    private void setUpdatedAt() {
        this.updatedAt = new Date();
    }


}
