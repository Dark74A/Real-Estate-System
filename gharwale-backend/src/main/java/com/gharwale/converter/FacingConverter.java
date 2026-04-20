package com.gharwale.converter;

import com.gharwale.entity.Facing;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class FacingConverter implements AttributeConverter<Facing, String> {

    @Override
    public String convertToDatabaseColumn(Facing attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public Facing convertToEntityAttribute(String dbData) {
        return dbData == null ? null : Facing.fromValue(dbData);
    }
}