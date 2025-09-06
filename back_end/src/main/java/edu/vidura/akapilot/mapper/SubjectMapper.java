package edu.vidura.akapilot.mapper;

import edu.vidura.akapilot.dto.SubjectsDTO;
import edu.vidura.akapilot.entity.Subjects;

public class SubjectMapper {

    // DTO → Entity
    public static Subjects toEntity(SubjectsDTO dto) {
        if (dto == null) return null;
        return Subjects.builder()
                .name(dto.getName())
                .color(dto.getColor())
                .Description(dto.getDescription())
                .difficulty(dto.getDifficulty())
                .priority(dto.getPriority())
                .build();
    }

    // Entity → DTO
    public static SubjectsDTO toDTO(Subjects entity) {
        if (entity == null) return null;
        return new SubjectsDTO(
                entity.getName(),
                entity.getColor(),
                entity.getDescription(),
                entity.getDifficulty(),
                entity.getPriority()
        );
    }
}
