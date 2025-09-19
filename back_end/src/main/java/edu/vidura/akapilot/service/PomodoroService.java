package edu.vidura.akapilot.service;

import edu.vidura.akapilot.dto.PomodorosDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface PomodoroService {
    List<PomodorosDTO> getPomodorosBySession(Long sessionId);
    PomodorosDTO startPomodoro(@Valid PomodorosDTO pomodorosDTO);
    PomodorosDTO updatePomodoro(Long id, @Valid PomodorosDTO pomodorosDTO);
    void deletePomodoro(Long id);
}
