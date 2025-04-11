package com.logic.report_central.dtos.shared;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@AllArgsConstructor
public class ErrorDTO {

    private String message;
    private String error;

}
