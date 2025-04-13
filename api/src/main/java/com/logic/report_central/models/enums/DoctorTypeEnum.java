package com.logic.report_central.models.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DoctorTypeEnum {
    E("Executante"),
    S("Solicitante");

    private final String description;
}
