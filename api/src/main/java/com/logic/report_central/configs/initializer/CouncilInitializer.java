package com.logic.report_central.configs.initializer;

import com.logic.report_central.models.entities.Council;
import com.logic.report_central.repositories.CouncilRepository;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;


@Component

@NoArgsConstructor
public class CouncilInitializer implements CommandLineRunner {

    @Autowired
    private CouncilRepository councilRepository;

    @Override
    public void run(String... args) throws Exception {
        List<Council> councilsToCreate = Arrays.asList(
                new Council("Conselho Regional de Medicina", "CRM"),
                new Council("Conselho Regional de Odontologia", "CRO"),
                new Council("Conselho Regional de Enfermagem", "COREN"),
                new Council("Conselho Regional de Farmácia", "CRF"),
                new Council("Conselho Regional de Fisioterapia e Terapia Ocupacional", "CREFITO"),
                new Council("Conselho Regional de Psicologia", "CRP"),
                new Council("Conselho Regional de Medicina Veterinária", "CRMV"),
                new Council("Conselho Regional de Nutricionistas", "CRN")
        );

        for (Council council : councilsToCreate) {
            if (councilRepository.findByName(council.getName()).isEmpty()) {
                councilRepository.save(council);
            }
        }
    }
}