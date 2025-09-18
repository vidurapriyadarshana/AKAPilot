package edu.vidura.akapilot.mapper;

import edu.vidura.akapilot.dto.SubjectsDTO;
import edu.vidura.akapilot.entity.Subjects;

public class SubjectMapper {

    // DTO → Entity
    public static Subjects toEntity(SubjectsDTO dto) {
        if (dto == null) return null;
        return Subjects.builder()
                .id(dto.getId() != null ? dto.getId() : 0L) // handle optional id
                .name(dto.getName())
                .color(dto.getColor())
                .description(dto.getDescription()) // fixed case
                .difficulty(dto.getDifficulty())
                .priority(dto.getPriority())
                .build();
    }

    // Entity → DTO
    public static SubjectsDTO toDTO(Subjects entity) {
        if (entity == null) return null;
        SubjectsDTO dto = new SubjectsDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setColor(entity.getColor());
        dto.setDescription(entity.getDescription()); // fixed case
        dto.setDifficulty(entity.getDifficulty());
        dto.setPriority(entity.getPriority());
        return dto;
    }
}
