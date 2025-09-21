package edu.vidura.akapilot.service.impl;

import edu.vidura.akapilot.dto.PomodorosDTO;
import edu.vidura.akapilot.entity.Pomodoros;
import edu.vidura.akapilot.entity.Subjects;
import edu.vidura.akapilot.entity.User;
import edu.vidura.akapilot.exception.OperationNotAllowedException;
import edu.vidura.akapilot.exception.ResourceNotFoundException;
import edu.vidura.akapilot.mapper.PomodoroMapper;
import edu.vidura.akapilot.repo.PomodoroRepo;
import edu.vidura.akapilot.repo.SubjectRepo;
import edu.vidura.akapilot.repo.UserRepo;
import edu.vidura.akapilot.service.PomodoroService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PomodoroServiceImpl implements PomodoroService {

    private final PomodoroRepo pomodoroRepo;
    private final SubjectRepo subjectsRepo;
    private final UserRepo userRepo;

    @Override
    public List<PomodorosDTO> getPomodorosBySubject(Long subjectId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Subjects subject = subjectsRepo.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        if (!subject.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You are not allowed to access this subject");
        }

        return pomodoroRepo.findAllBySubjects_Id(subjectId).stream()
                .map(PomodoroMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PomodorosDTO startPomodoro(PomodorosDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Subjects subject = subjectsRepo.findById(dto.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        if (!subject.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You are not allowed to add pomodoros to this subject");
        }

        Pomodoros pomodoro = PomodoroMapper.toEntity(dto, subject, user);
        pomodoro.setUser(user);
        Pomodoros saved = pomodoroRepo.save(pomodoro);
        return PomodoroMapper.toDTO(saved);
    }

    @Override
    public PomodorosDTO updatePomodoro(Long id, PomodorosDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Pomodoros existing = pomodoroRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pomodoro not found"));

        Subjects subject = subjectsRepo.findById(dto.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        if (!subject.getUser().getId().equals(user.getId()) ||
                !existing.getSubjects().getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You are not allowed to update this pomodoro");
        }

        existing.setDurationMinutes(dto.getDurationMinutes());
        existing.setBreakMinutes(dto.getBreakMinutes());
        existing.setCompleted(dto.getCompleted());
        existing.setSubjects(subject);

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

        if (!pomodoro.getSubjects().getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You are not allowed to delete this pomodoro");
        }

        pomodoroRepo.delete(pomodoro);
    }

    @Override
    public List<PomodorosDTO> getAllPomodorosByUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return pomodoroRepo.findAllByUser_Id(user.getId()).stream()
                .map(PomodoroMapper::toDTO)
                .collect(Collectors.toList());
    }
}
