package edu.vidura.akapilot.mapper;

import edu.vidura.akapilot.dto.PomodorosDTO;
import edu.vidura.akapilot.entity.Pomodoros;
import edu.vidura.akapilot.entity.Subjects;
import edu.vidura.akapilot.entity.User;

public class PomodoroMapper {

    // Convert DTO → Entity including user and subject
    public static Pomodoros toEntity(PomodorosDTO dto, Subjects subject, User user) {
        if (dto == null) return null;

        return Pomodoros.builder()
                .id(dto.getId() != null ? dto.getId() : 0)
                .durationMinutes(dto.getDurationMinutes())
                .breakMinutes(dto.getBreakMinutes())
                .completed(dto.getCompleted())
                .subjects(subject)
                .user(user)
                .build();
    }

    // Convert Entity → DTO
    public static PomodorosDTO toDTO(Pomodoros entity) {
        if (entity == null) return null;

        PomodorosDTO dto = new PomodorosDTO();
        dto.setId(entity.getId());
        dto.setDurationMinutes(entity.getDurationMinutes());
        dto.setBreakMinutes(entity.getBreakMinutes());
        dto.setCompleted(entity.isCompleted());
        dto.setCreatedAt(entity.getCreatedAt());

        if (entity.getSubjects() != null) {
            dto.setSubjectId(entity.getSubjects().getId());
        }

        return dto;
    }
}
