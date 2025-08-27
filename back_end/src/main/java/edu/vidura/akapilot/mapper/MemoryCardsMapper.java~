package edu.vidura.akapilot.mapper;

import edu.vidura.akapilot.dto.MemoryCardsDTO;
import edu.vidura.akapilot.entity.MemoryCards;
import edu.vidura.akapilot.entity.Subjects;

public class MemoryCardsMapper {

    // Convert entity → DTO (include id only in response)
    public static MemoryCardsDTO toDTO(MemoryCards memoryCards) {
        if (memoryCards == null) return null;

        return MemoryCardsDTO.builder()
                .front(memoryCards.getFront())
                .back(memoryCards.getBack())
                .status(memoryCards.getStatus())
                .deadline(memoryCards.getDeadline())
                .subjectId(
                        memoryCards.getSubjects() != null ? memoryCards.getSubjects().getId() : null
                )
                .build();
    }

    // Convert DTO → entity (id is auto-generated, not taken from DTO)
    public static MemoryCards toEntity(MemoryCardsDTO dto, Subjects subject) {
        if (dto == null) return null;

        return MemoryCards.builder()
                .front(dto.getFront())
                .back(dto.getBack())
                .status(dto.getStatus())
                .deadline(dto.getDeadline())
                .subjects(subject) // attach subject entity
                .build();
    }
}
