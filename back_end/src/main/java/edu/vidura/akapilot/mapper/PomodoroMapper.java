package edu.vidura.akapilot.mapper;

import edu.vidura.akapilot.dto.PomodorosDTO;
import edu.vidura.akapilot.entity.Pomodoros;
import edu.vidura.akapilot.entity.StudySessions;

public class PomodoroMapper {

    /**
     * Convert DTO → Entity
     */
    public static Pomodoros toEntity(PomodorosDTO dto, StudySessions studySession) {
        if (dto == null) {
            return null;
        }

        return Pomodoros.builder()
                .id(dto.getId() != null ? dto.getId() : 0) // handle optional ID
                .durationMinutes(dto.getDurationMinutes())
                .breakMinutes(dto.getBreakMinutes())
                .completed(dto.getCompleted())
                .createdAt(dto.getCreatedAt()) // if null, @CreationTimestamp will set it
                .studySessions(studySession)
                .build();
    }

    /**
     * Convert Entity → DTO
     */
    public static PomodorosDTO toDTO(Pomodoros entity) {
        if (entity == null) {
            return null;
        }

        PomodorosDTO dto = new PomodorosDTO();
        dto.setId(entity.getId());
        dto.setDurationMinutes(entity.getDurationMinutes());
        dto.setBreakMinutes(entity.getBreakMinutes());
        dto.setCompleted(entity.isCompleted());
        dto.setCreatedAt(entity.getCreatedAt());

        if (entity.getStudySessions() != null) {
            dto.setStudySessionId(entity.getStudySessions().getId());
        }

        return dto;
    }
}
