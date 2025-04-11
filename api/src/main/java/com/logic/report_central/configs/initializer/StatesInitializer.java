package com.logic.report_central.configs.initializer;

import com.logic.report_central.entities.States;
import com.logic.report_central.repositories.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class StatesInitializer implements CommandLineRunner {

    @Autowired
    private StateRepository statesRepository;

    @Override
    public void run(String... args) {
        if (statesRepository.count() == 0) {
            List<States> initialStates = Arrays.asList(
                    new States("Acre", "AC"),
                    new States("Alagoas", "AL"),
                    new States("Amapá", "AP"),
                    new States("Amazonas", "AM"),
                    new States("Bahia", "BA"),
                    new States("Ceará", "CE"),
                    new States("Distrito Federal", "DF"),
                    new States("Espírito Santo", "ES"),
                    new States("Goiás", "GO"),
                    new States("Maranhão", "MA"),
                    new States("Mato Grosso", "MT"),
                    new States("Mato Grosso do Sul", "MS"),
                    new States("Minas Gerais", "MG"),
                    new States("Pará", "PA"),
                    new States("Paraíba", "PB"),
                    new States("Paraná", "PR"),
                    new States("Pernambuco", "PE"),
                    new States("Piauí", "PI"),
                    new States("Rio de Janeiro", "RJ"),
                    new States("Rio Grande do Norte", "RN"),
                    new States("Rio Grande do Sul", "RS"),
                    new States("Rondônia", "RO"),
                    new States("Roraima", "RR"),
                    new States("Santa Catarina", "SC"),
                    new States("São Paulo", "SP"),
                    new States("Sergipe", "SE"),
                    new States("Tocantins", "TO")
            );

            statesRepository.saveAll(initialStates);
            System.out.println("Estados iniciados no banco de dados.");
        } else {
            System.out.println("Estados já existem no banco de dados.");
        }
    }
}