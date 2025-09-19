package edu.vidura.akapilot.controller;

import edu.vidura.akapilot.api.ApiResponse;
import edu.vidura.akapilot.dto.CardReviewsDTO;
import edu.vidura.akapilot.service.CardReviewsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class CardReviewsController {

    private final CardReviewsService cardReviewsService;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> postMemoryCards(@Valid @RequestBody CardReviewsDTO cardReviewsDTO) {
        CardReviewsDTO saved = cardReviewsService.saveCardReviews(cardReviewsDTO);
        return ResponseEntity.ok(new ApiResponse(200, "Memory card saved successfully", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllReviewsForLoggedInUser() {
        List<CardReviewsDTO> reviews = cardReviewsService.getReviewsForLoggedInUser();
        return ResponseEntity.ok(new ApiResponse(200, "All reviews for logged-in user", reviews));
    }

    @GetMapping("/card/{cardId}")
    public ResponseEntity<ApiResponse> getReviewsForCard(@PathVariable Long cardId) {
        List<CardReviewsDTO> reviews = cardReviewsService.getReviewsByCardId(cardId);
        return ResponseEntity.ok(new ApiResponse(200, "Reviews for memory card " + cardId, reviews));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getReviewsForUser(@PathVariable Long userId) {
        List<CardReviewsDTO> reviews = cardReviewsService.getReviewsByUserId(userId);
        return ResponseEntity.ok(new ApiResponse(200, "Reviews for user " + userId, reviews));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse> getReviewSummary() {
        Object summary = cardReviewsService.getReviewSummary();
        return ResponseEntity.ok(new ApiResponse(200, "Review summary", summary));
    }
}
