package edu.vidura.akapilot.controller;

import edu.vidura.akapilot.api.ApiResponse;
import edu.vidura.akapilot.dto.PomodorosDTO;
import edu.vidura.akapilot.service.PomodoroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pomodoros")
@RequiredArgsConstructor
public class PomodoroController {

    private final PomodoroService pomodoroService;

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse> getPomodorosBySubject(@PathVariable Long subjectId) {
        List<PomodorosDTO> pomodoros = pomodoroService.getPomodorosBySubject(subjectId);
        return ResponseEntity.ok(new ApiResponse(200, "Pomodoros fetched successfully", pomodoros));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> startPomodoro(@Valid @RequestBody PomodorosDTO pomodorosDTO) {
        PomodorosDTO saved = pomodoroService.startPomodoro(pomodorosDTO);
        return ResponseEntity.ok(new ApiResponse(200, "Pomodoro started successfully", saved));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updatePomodoro(
            @PathVariable Long id,
            @Valid @RequestBody PomodorosDTO pomodorosDTO) {
        PomodorosDTO updated = pomodoroService.updatePomodoro(id, pomodorosDTO);
        return ResponseEntity.ok(new ApiResponse(200, "Pomodoro updated successfully", updated));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deletePomodoro(@PathVariable Long id) {
        pomodoroService.deletePomodoro(id);
        return ResponseEntity.ok(new ApiResponse(200, "Pomodoro deleted successfully", null));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse> getAllPomodorosByUser() {
        List<PomodorosDTO> pomodoros = pomodoroService.getAllPomodorosByUser();
        return ResponseEntity.ok(new ApiResponse(200, "Pomodoros fetched for user successfully", pomodoros));
    }
}
