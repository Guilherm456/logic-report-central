package com.logic.report_central.entities;

import com.logic.report_central.enums.CouncilEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doctor_boards")

@Getter
@Setter
@NoArgsConstructor
public class DoctorBoard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "council_type", columnDefinition = "CHAR(6)", nullable = false)
    private CouncilEnum councilType;

    @Column(name = "council_number", nullable = false)
    private String councilNumber;

    @ManyToOne
    @JoinColumn(name = "state_id", nullable = false)
    private States state;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    public DoctorBoard(CouncilEnum councilType, String councilNumber, States state, Doctor doctor) {
        this.councilType = councilType;
        this.councilNumber = councilNumber;
        this.state = state;
        this.doctor = doctor;
    }
}