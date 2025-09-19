package edu.vidura.akapilot.service.impl;

import edu.vidura.akapilot.dto.StudySessionsDTO;
import edu.vidura.akapilot.dto.StudySummaryDTO;
import edu.vidura.akapilot.dto.TodosDTO;
import edu.vidura.akapilot.entity.StudySessions;
import edu.vidura.akapilot.entity.Subjects;
import edu.vidura.akapilot.entity.Todos;
import edu.vidura.akapilot.entity.User;
import edu.vidura.akapilot.exception.OperationNotAllowedException;
import edu.vidura.akapilot.exception.ResourceNotFoundException;
import edu.vidura.akapilot.mapper.StudySessionsMapper;
import edu.vidura.akapilot.repo.StudySessionsRepo;
import edu.vidura.akapilot.repo.SubjectRepo;
import edu.vidura.akapilot.repo.TodoRepo;
import edu.vidura.akapilot.repo.UserRepo;
import edu.vidura.akapilot.service.StudySessionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StudySessionsServiceImpl implements StudySessionsService {

    private final StudySessionsRepo studySessionsRepo;
    private final UserRepo userRepo;
    private final SubjectRepo subjectRepo;
    private final TodoRepo todoRepo;

    @Override
    public StudySessionsDTO createSession(StudySessionsDTO studySessionsDTO) {
        // ✅ Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ✅ Fetch subject
        Subjects subject = subjectRepo.findById(studySessionsDTO.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + studySessionsDTO.getSubjectId()));

        // ✅ Ensure subject belongs to current user
        if (!subject.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You do not own this subject");
        }

        // ✅ Fetch todo if provided
        Todos todo = null;
        if (studySessionsDTO.getTodoId() != null) {
            todo = todoRepo.findById(studySessionsDTO.getTodoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + studySessionsDTO.getTodoId()));

            // ownership check
            if (!todo.getUser().getId().equals(user.getId())) {
                throw new OperationNotAllowedException("You do not own this todo");
            }
        }

        // ✅ Map DTO → Entity
        StudySessions entity = StudySessionsMapper.toEntity(studySessionsDTO, user, subject, todo);

        // ✅ Save
        StudySessions saved = studySessionsRepo.save(entity);

        // ✅ Return DTO
        return StudySessionsMapper.toDTO(saved);
    }

    @Override
    public List<StudySessionsDTO> getAllSessions() {
        // ✅ Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ✅ Fetch all sessions belonging to this user
        List<StudySessions> sessions = studySessionsRepo.findByUser(user);

        // ✅ Convert to DTOs
        return sessions.stream()
                .map(StudySessionsMapper::toDTO)
                .toList();
    }

    @Override
    public StudySessionsDTO getSessionsById(Long id) {
        // 1️⃣ Fetch the session by ID
        StudySessions session = studySessionsRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study session not found with id: " + id));

        // 2️⃣ Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 3️⃣ Check ownership
        if (!session.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You do not own this study session");
        }

        // 4️⃣ Convert to DTO and return
        return StudySessionsMapper.toDTO(session);
    }

    @Override
    public StudySessionsDTO updateSession(Long id, StudySessionsDTO dto) {
        // 1️⃣ Fetch the session
        StudySessions session = studySessionsRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study session not found with id: " + id));

        // 2️⃣ Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 3️⃣ Ownership check
        if (!session.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You do not own this study session");
        }

        // 4️⃣ Update basic fields
        session.setStartTime(dto.getStartTime());
        session.setEndTime(dto.getEndTime());
        session.setNotes(dto.getNotes());

        // 5️⃣ Update subject if provided, and check ownership
        if (dto.getSubjectId() != null) {
            Subjects subject = subjectRepo.findById(dto.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

            if (!subject.getUser().getId().equals(user.getId())) {
                throw new OperationNotAllowedException("You do not own this subject");
            }

            session.setSubjects(subject);
        }

        // 6️⃣ Update todo if provided, and check ownership
        if (dto.getTodoId() != null) {
            Todos todo = todoRepo.findById(dto.getTodoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Todo not found"));

            if (!todo.getUser().getId().equals(user.getId())) {
                throw new OperationNotAllowedException("You do not own this todo");
            }

            session.setTodos(todo);
        }

        // 7️⃣ Save and return DTO
        return StudySessionsMapper.toDTO(studySessionsRepo.save(session));
    }

    @Override
    public void deleteSession(Long id) {
        // 1️⃣ Fetch the session
        StudySessions session = studySessionsRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study session not found with id: " + id));

        // 2️⃣ Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 3️⃣ Ownership check
        if (!session.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You do not own this study session");
        }

        // 4️⃣ Delete
        studySessionsRepo.delete(session);
    }

    public List<StudySummaryDTO> getTotalStudyHoursBySubject(Long userId) {
        List<Object[]> sessions = studySessionsRepo.findSessionsWithSubject(userId);
        Map<Long, StudySummaryDTO> map = new HashMap<>();

        for (Object[] row : sessions) {
            Long subjectId = (Long) row[0];
            String subjectName = (String) row[1];
            LocalDateTime start = (LocalDateTime) row[2];
            LocalDateTime end = (LocalDateTime) row[3];

            long minutes = java.time.Duration.between(start, end).toMinutes();

            map.compute(subjectId, (k, v) -> {
                if (v == null) return new StudySummaryDTO(subjectId, subjectName, minutes);
                v.setTotalStudyMinutes(v.getTotalStudyMinutes() + minutes);
                return v;
            });
        }


        return new ArrayList<>(map.values());
    }

    @Override
    public List<StudySessionsDTO> getTodaysSessions() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        List<StudySessions> sessions = studySessionsRepo.findAllByUser_IdAndStartTimeBetween(
                user.getId(), startOfDay, endOfDay
        );

        return sessions.stream()
                .map(StudySessionsMapper::toDTO)
                .toList();
    }


}
