// LoginRequest.java
package com.logic.report_central.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthDTO {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min=6)
    private String password;
}
