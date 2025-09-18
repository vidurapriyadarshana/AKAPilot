package edu.vidura.akapilot.controller;

import edu.vidura.akapilot.api.ApiResponse;
import edu.vidura.akapilot.dto.CardReviewsDTO;
import edu.vidura.akapilot.service.CardReviewsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
