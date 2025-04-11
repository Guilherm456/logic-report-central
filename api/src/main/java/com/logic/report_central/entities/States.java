package com.logic.report_central.entities;

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

    @Column(columnDefinition = "VARCHAR(50)")
    private String name;

    @Column(columnDefinition = "VARCHAR(2)")
    private String uf;

    @OneToMany
    @JoinColumn(name = "state_id")
    private List<DoctorBoard> doctorBoards;

    public States(String name, String uf) {
        this.name = name;
        this.uf = uf;
    }
}
