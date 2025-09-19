package edu.vidura.akapilot.mapper;

import edu.vidura.akapilot.dto.StudySessionsDTO;
import edu.vidura.akapilot.entity.StudySessions;
import edu.vidura.akapilot.entity.Subjects;
import edu.vidura.akapilot.entity.Todos;
import edu.vidura.akapilot.entity.User;

public class StudySessionsMapper {

    // Convert DTO -> Entity
    public static StudySessions toEntity(StudySessionsDTO dto, User user, Subjects subject, Todos todo) {
        return StudySessions.builder()
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .notes(dto.getNotes())
                .user(user)          // pass User from service layer
                .subjects(subject)   // pass Subject entity from DB
                .todos(todo)         // pass Todo entity (can be null)
                .build();
    }

    // Convert Entity -> DTO
    public static StudySessionsDTO toDTO(StudySessions entity) {
        return new StudySessionsDTO(
                entity.getId(),
                entity.getStartTime(),
                entity.getEndTime(),
                entity.getNotes(),
                entity.getSubjects() != null ? entity.getSubjects().getId() : null,
                entity.getTodos() != null ? entity.getTodos().getId() : null
        );
    }
}
