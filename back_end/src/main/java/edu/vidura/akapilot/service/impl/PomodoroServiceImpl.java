package edu.vidura.akapilot.service.impl;

import edu.vidura.akapilot.dto.PomodorosDTO;
import edu.vidura.akapilot.entity.Pomodoros;
import edu.vidura.akapilot.entity.StudySessions;
import edu.vidura.akapilot.entity.User;
import edu.vidura.akapilot.exception.OperationNotAllowedException;
import edu.vidura.akapilot.exception.ResourceNotFoundException;
import edu.vidura.akapilot.mapper.PomodoroMapper;
import edu.vidura.akapilot.repo.PomodoroRepo;
import edu.vidura.akapilot.repo.StudySessionsRepo;
import edu.vidura.akapilot.repo.UserRepo;
import edu.vidura.akapilot.service.PomodoroService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PomodoroServiceImpl implements PomodoroService {

    private final PomodoroRepo pomodoroRepo;
    private final StudySessionsRepo studySessionRepo;
    private final UserRepo userRepo;

    @Override
    public List<PomodorosDTO> getPomodorosBySession(Long sessionId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        StudySessions session = studySessionRepo.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Study session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You are not allowed to access this session");
        }

        List<Pomodoros> pomodoros = pomodoroRepo.findAllByStudySessions_Id(sessionId);

        return pomodoros.stream()
                .map(PomodoroMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Override
    public PomodorosDTO startPomodoro(PomodorosDTO pomodorosDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        StudySessions session = studySessionRepo.findById(pomodorosDTO.getStudySessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Study session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You are not allowed to add pomodoros to this session");
        }

        Pomodoros pomodoro = PomodoroMapper.toEntity(pomodorosDTO, session);
        Pomodoros saved = pomodoroRepo.save(pomodoro);

        return PomodoroMapper.toDTO(saved);
    }

    @Override
    public PomodorosDTO updatePomodoro(Long id, PomodorosDTO pomodorosDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Pomodoros existing = pomodoroRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pomodoro not found"));

        if (!existing.getStudySessions().getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You are not allowed to update this pomodoro");
        }

        // fetch the session from DTO
        StudySessions session = studySessionRepo.findById(pomodorosDTO.getStudySessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Study session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You are not allowed to assign this pomodoro to that session");
        }

        // update allowed fields
        existing.setDurationMinutes(pomodorosDTO.getDurationMinutes());
        existing.setBreakMinutes(pomodorosDTO.getBreakMinutes());
        existing.setCompleted(pomodorosDTO.getCompleted());
        existing.setStudySessions(session); // ✅ set the new session

        Pomodoros updated = pomodoroRepo.save(existing);

        return PomodoroMapper.toDTO(updated);
    }


    @Override
    public void deletePomodoro(Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Pomodoros pomodoro = pomodoroRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pomodoro not found"));

        if (!pomodoro.getStudySessions().getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You are not allowed to delete this pomodoro");
        }

        pomodoroRepo.delete(pomodoro);
    }
}
