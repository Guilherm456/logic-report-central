package com.logic.report_central.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Table(name = "councils")
@Entity

@Getter
@Setter
@NoArgsConstructor
public class Council {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length=10, nullable = false)
    private String acronym;

    @Column(nullable = false, updatable = false)
    Date createdAt;

    @Column(nullable = false)
    Date updatedAt;

    @OneToMany
    @JoinColumn(name = "council_id")
    @JsonIgnore
    private List<Doctor> doctors;

    public Council(String name, String acronym) {
        this.name = name;
        this.acronym = acronym;
    }

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
