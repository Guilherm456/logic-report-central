package com.logic.report_central.annotations;

import com.logic.report_central.configs.utils.Validators.EnumValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = {EnumValidator.class})
public @interface ValidEnum {
    Class<? extends Enum<?>> enumClass();
    String message() default "Valor inválido para o enum";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}