package edu.vidura.akapilot.mapper;

import edu.vidura.akapilot.dto.CardReviewsDTO;
import edu.vidura.akapilot.entity.CardReviews;
import edu.vidura.akapilot.entity.MemoryCards;
import edu.vidura.akapilot.entity.User;

public class CardReviewsMapper {

    // Convert Entity -> DTO
    public static CardReviewsDTO toDTO(CardReviews entity) {
        if (entity == null) return null;

        return new CardReviewsDTO(
                entity.getId(),
                entity.getReviewDate(),
                entity.isSuccess(),
                entity.getMemoryCards() != null ? entity.getMemoryCards().getId() : null,
                entity.getUser() != null ? entity.getUser().getId() : null
        );
    }

    // Convert DTO -> Entity (needs User + MemoryCards resolved beforehand)
    public static CardReviews toEntity(CardReviewsDTO dto, User user, MemoryCards memoryCards) {
        if (dto == null) return null;

        return CardReviews.builder()
                .id(dto.getId())
                .success(dto.getSuccess())
                .memoryCards(memoryCards)
                .user(user)
                .build();
    }
}
