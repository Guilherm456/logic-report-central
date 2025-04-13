package com.logic.report_central.models.serializers;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.logic.report_central.models.enums.StatusEnum;

import java.io.IOException;

public class StatusEnumSerializer extends JsonSerializer<StatusEnum> {

    @Override
    public void serialize(StatusEnum value, JsonGenerator gen, SerializerProvider serializers) throws IOException {

        if (value == StatusEnum.A) {
            gen.writeBoolean(true);
        } else if (value == StatusEnum.I) {
            gen.writeBoolean(false);
        } else if (value == StatusEnum.D) {
            gen.writeNull();
        }
    }
}