package com.logic.report_central.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TemplateDTO {

    @NotBlank(message = "Descrição não pode ser vazio")
    @Size(min = 2, max = 50, message = "Descrição deve ter entre 2 e 50 caracteres")
    private String description;

    @NotBlank(message = "Conteúdo não pode ser vazio")
    @Size(min = 2, max = 5000, message = "Conteúdo deve ter entre 2 e 5000 caracteres")
    private String content;

    @NotNull(message = "Deve haver um médico associado")
    private Long doctor_id;

}
