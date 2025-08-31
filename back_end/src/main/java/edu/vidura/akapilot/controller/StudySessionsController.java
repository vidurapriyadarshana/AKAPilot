package edu.vidura.akapilot.controller;

import edu.vidura.akapilot.api.ApiResponse;
import edu.vidura.akapilot.dto.StudySessionsDTO;
import edu.vidura.akapilot.service.StudySessionsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class StudySessionsController {

    private final StudySessionsService studySessionsService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> startSession(
            @Valid @RequestBody StudySessionsDTO studySessionsDTO) {
        StudySessionsDTO saved = studySessionsService.createSession(studySessionsDTO);
        return ResponseEntity.ok(new ApiResponse(200, "Subject saved successfully", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getTodo() {
        List<StudySessionsDTO> sessionsList = studySessionsService.getAllSessions();
        return ResponseEntity.ok(new ApiResponse(200, "Success", sessionsList));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getTodoById(@PathVariable Long id) {
        StudySessionsDTO session = studySessionsService.getSessionsById(id);
        return ResponseEntity.ok(new ApiResponse(200, "Success", session));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateSession(
            @PathVariable Long id,
            @Valid @RequestBody StudySessionsDTO dto) {

        StudySessionsDTO updated = studySessionsService.updateSession(id, dto);
        return ResponseEntity.ok(new ApiResponse(200, "Study session updated successfully", updated));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteSession(@PathVariable Long id) {
        studySessionsService.deleteSession(id);
        return ResponseEntity.ok(new ApiResponse(200, "Study session deleted successfully", null));
    }

}
