package edu.vidura.akapilot.controller;

import edu.vidura.akapilot.api.ApiResponse;
import edu.vidura.akapilot.dto.MemoryCardsDTO;
import edu.vidura.akapilot.dto.SubjectsDTO;
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
        return ResponseEntity.ok(new ApiResponse(200, "Memory card saved successfully", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getMemoryCards() {
        List<MemoryCardsDTO> memoryCardsList = memoryCardsService.getAllMemoryCards();
        return ResponseEntity.ok(new ApiResponse(200, "Success", memoryCardsList));
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateMemoryCards(
            @PathVariable Long id, @Valid @RequestBody MemoryCardsDTO memoryCardsDTO) {
        MemoryCardsDTO updated = memoryCardsService.updateMemoryCards(id, memoryCardsDTO);
        return ResponseEntity.ok(new ApiResponse(200, "Memory card updated successfully", updated));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteMemoryCards(@PathVariable Long id) {
        memoryCardsService.deleteMemoryCards(id);
        return ResponseEntity.ok(new ApiResponse(200, "Memory card deleted successfully", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getMemoryCardsById(@PathVariable Long id) {
        MemoryCardsDTO memoryCards = memoryCardsService.getMemoryCardsById(id);
        return ResponseEntity.ok(new ApiResponse(200, "Success", memoryCards));
    }
}
