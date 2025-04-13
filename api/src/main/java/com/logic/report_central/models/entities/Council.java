package com.logic.report_central.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Table(name = "councils")
@Entity

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class Council {

    @Column(nullable = false, updatable = false)
    Date createdAt;
    @Column(nullable = false)
    Date updatedAt;
    
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Column(length = 100, nullable = false)
    private String name;

    @NonNull
    @Column(length = 10, nullable = false)
    private String acronym;

    @OneToMany
    @JoinColumn(name = "council_id")
    @JsonIgnore
    private List<Doctor> doctors;

    @PrePersist
    private void onCreate() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @PreUpdate
    private void onUpdate() {
        this.updatedAt = new Date();
    }

}
