package com.logic.report_central.dtos;

import com.logic.report_central.annotations.ValidEnum;
import com.logic.report_central.enums.Gender;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Date;

@Data
public class ReportDTO {

    @NotBlank(message = "Nome do paciente é obrigatório")
    @Size(min = 2, max = 50, message = "Nome do paciente deve ter entre 2 e 50 caracteres")
    private String patient_name;

    @NotNull(message = "Nome do paciente é obrigatório")
    @Enumerated()
    @ValidEnum(enumClass = Gender.class, message = "Gênero inválido")
    private Gender patient_gender;

    @NotNull(message = "Data de nascimento do paciente é obrigatória")
    private Date patient_birth_date;

    @NotNull(message = "O médico solicitante é obrigatório")
    private Long doctor_requester_id;

    @NotBlank(message = "O conteúdo do laudo é obrigatório")
    @Size(min = 2, max = 5000, message = "O conteúdo do laudo deve ter entre 2 e 5000 caracteres")
    private String report_content;

}
