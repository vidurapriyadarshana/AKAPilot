package edu.vidura.akapilot.controller;

import edu.vidura.akapilot.api.ApiResponse;
import edu.vidura.akapilot.dto.MemoryCardsDTO;
import edu.vidura.akapilot.service.MemoryCardsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/memory")
@RequiredArgsConstructor
public class MemoryCardsController {

    private final MemoryCardsService memoryCardsService;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> postMemoryCards(@Valid @RequestBody MemoryCardsDTO memoryCardsDTO) {
        MemoryCardsDTO saved = memoryCardsService.saveMemoryCards(memoryCardsDTO);
        return ResponseEntity.ok(new ApiResponse(200, "OK", saved)); // return saved object
    }


    @GetMapping
    public ResponseEntity<ApiResponse> getMemoryCards() {
        List<MemoryCardsDTO> memoryCardsList = memoryCardsService.getAllMemoryCards();
        return ResponseEntity.ok(new ApiResponse(200, "OK", memoryCardsList));
    }


    @PutMapping
    public ResponseEntity<ApiResponse> updateMemoryCards() {
        return ResponseEntity.ok(new ApiResponse(200, "OK", null));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> deleteMemoryCards() {
        return ResponseEntity.ok(new ApiResponse(200, "OK", null));
    }
}
