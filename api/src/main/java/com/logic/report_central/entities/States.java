package com.logic.report_central.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Table(name = "states")
@Entity

@NoArgsConstructor
@Getter
@Setter
public class States {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(length=2, nullable = false)
    private String uf;

    @OneToMany
    @JoinColumn(name = "state_id")
    @JsonIgnore
    private List<Doctor> doctors;

    public States(String name, String uf) {
        this.name = name;
        this.uf = uf;
    }
}
