package com.logic.report_central.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Table(name = "states")
@Entity

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class States {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Column(length = 50, nullable = false)
    private String name;

    @NonNull
    @Column(length = 2, nullable = false)
    private String uf;

    @OneToMany
    @JoinColumn(name = "state_id")
    @JsonIgnore
    private List<Doctor> doctors;


}
