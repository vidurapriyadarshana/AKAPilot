package edu.vidura.akapilot.mapper;

import edu.vidura.akapilot.dto.TodosDTO;
import edu.vidura.akapilot.entity.Subjects;
import edu.vidura.akapilot.entity.Todos;
import edu.vidura.akapilot.entity.User;

public class TodosMapper {

    // DTO → Entity
    public static Todos toEntity(TodosDTO dto, User user, Subjects subject) {
        if (dto == null) return null;

        return Todos.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .dueDate(dto.getDueDate())
                .completed(dto.isCompleted())
                .priority(dto.getPriority())
                .user(user)         // assigned in service layer
                .subjects(subject)  // resolved in service layer
                .build();
    }

    // Entity → DTO
    public static TodosDTO toDTO(Todos entity) {
        if (entity == null) return null;

        return new TodosDTO(
                entity.getTitle(),
                entity.getDescription(),
                entity.getDueDate(),
                entity.isCompleted(),
                entity.getPriority(),
                entity.getSubjects() != null ? entity.getSubjects().getId() : null
        );
    }
}
