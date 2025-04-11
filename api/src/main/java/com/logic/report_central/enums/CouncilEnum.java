package com.logic.report_central.enums;

public enum CouncilEnum {
    CRM("Conselho Regional de Medicina"),
    CRO("Conselho Regional de Odontologia"),
    CRF("Conselho Regional de Farmácia"),
    COREN("Conselho Regional de Enfermagem"),
    CRN("Conselho Regional de Nutricionistas"),
    CRP("Conselho Regional de Psicologia"),
    CRMV("Conselho Regional de Medicina Veterinária"),
    ;

    private final String description;

    CouncilEnum(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}