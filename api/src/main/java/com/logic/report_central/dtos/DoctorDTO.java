package com.logic.report_central.dtos;

import com.logic.report_central.annotations.ValidEnum;
import com.logic.report_central.enums.DoctorTypeEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorDTO {

    @NotBlank
    @Size(min=2, max=50, message = "O nome deve ter entre 2 e 50 caracteres")
    private String name;

    @NotBlank
    @Pattern(regexp = "^[0-9]+$", message = "O número do conselho deve conter apenas números")
    @Size(min = 5, max = 12, message = "O número do conselho deve ter entre 5 e 12 dígitos")
    private String council_number;

    @NotNull
    @ValidEnum(enumClass = DoctorTypeEnum.class, message = "Tipo de médico inválido")
    DoctorTypeEnum doctor_type;
    @NotNull
    private Long council_id;
    @NotNull
    private Long state_id;
    @NotNull
    private Long user_id;
}
