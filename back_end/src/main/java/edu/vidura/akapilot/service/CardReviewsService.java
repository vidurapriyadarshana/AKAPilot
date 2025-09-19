package edu.vidura.akapilot.service;

import edu.vidura.akapilot.dto.CardReviewsDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface CardReviewsService {
    CardReviewsDTO saveCardReviews(@Valid CardReviewsDTO cardReviewsDTO);
    List<CardReviewsDTO> getReviewsForLoggedInUser();
    List<CardReviewsDTO> getReviewsByCardId(Long cardId);
    List<CardReviewsDTO> getReviewsByUserId(Long userId);
    Object getReviewSummary();
}
