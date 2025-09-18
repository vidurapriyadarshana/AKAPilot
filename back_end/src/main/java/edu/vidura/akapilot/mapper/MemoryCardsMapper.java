package edu.vidura.akapilot.mapper;

import edu.vidura.akapilot.dto.MemoryCardsDTO;
import edu.vidura.akapilot.entity.MemoryCards;
import edu.vidura.akapilot.entity.Subjects;

public class MemoryCardsMapper {

    // Convert entity → DTO
    public static MemoryCardsDTO toDTO(MemoryCards memoryCards) {
        if (memoryCards == null) return null;

        return MemoryCardsDTO.builder()
                .id(memoryCards.getId())
                .front(memoryCards.getFront())
                .back(memoryCards.getBack())
                .status(memoryCards.getStatus())
                .deadline(memoryCards.getDeadline())
                .subjectId(
                        memoryCards.getSubjects() != null ? memoryCards.getSubjects().getId() : null
                )
                .build();
    }

    // Convert DTO → new entity (useful for CREATE only)
    public static MemoryCards toEntity(MemoryCardsDTO dto, Subjects subject) {
        if (dto == null) return null;

        return MemoryCards.builder()
                .front(dto.getFront())
                .back(dto.getBack())
                .status(dto.getStatus())
                .deadline(dto.getDeadline())
                .subjects(subject)
                .build();
    }

    // ✅ Merge DTO → existing entity (for UPDATE)
    public static void merge(MemoryCardsDTO dto, MemoryCards entity) {
        if (dto == null || entity == null) return;

        entity.setFront(dto.getFront());
        entity.setBack(dto.getBack());
        entity.setStatus(dto.getStatus());
        entity.setDeadline(dto.getDeadline());
        // ⚠️ subject is NOT updated here (ownership stays the same)
    }
}

