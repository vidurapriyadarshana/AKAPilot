package edu.vidura.akapilot.service.impl;

import edu.vidura.akapilot.dto.SubjectsDTO;
import edu.vidura.akapilot.entity.Subjects;
import edu.vidura.akapilot.entity.User;
import edu.vidura.akapilot.exception.OperationNotAllowedException;
import edu.vidura.akapilot.exception.SubjectNotFoundException;
import edu.vidura.akapilot.mapper.SubjectMapper;
import edu.vidura.akapilot.repo.SubjectRepo;
import edu.vidura.akapilot.repo.UserRepo;
import edu.vidura.akapilot.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepo subjectRepo;
    private final UserRepo userRepo;

    @Override
    public List<SubjectsDTO> getAllSubjects() {
        // Get logged-in username
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Fetch user entity
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Fetch all subjects
        List<Subjects> subjects = subjectRepo.findAllByUser(user);

        // Convert entities → DTOs
        return subjects.stream()
                .map(SubjectMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SubjectsDTO saveSubject(SubjectsDTO subjectsDTO) {
        // Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Convert DTO → Entity
        Subjects subjects = SubjectMapper.toEntity(subjectsDTO);
        subjects.setUser(user);

        // Save entity
        Subjects saved = subjectRepo.save(subjects);

        // Convert Entity → DTO
        return SubjectMapper.toDTO(saved);
    }

    @Override
    public SubjectsDTO getSubject(Long id) {
        // Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Fetch subject
        Subjects subject = subjectRepo.findById(id).orElseThrow(
                () -> new SubjectNotFoundException("Subject not found")
        );

        if (subject != null && subject.getUser().getId().equals(user.getId())) {
            return SubjectMapper.toDTO(subject);
        }

        return null;
    }

    @Override
    public SubjectsDTO updateSubject(Long id, SubjectsDTO subjectsDTO) {
        // Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Find the subject by id and ensure it belongs to the logged-in user
        Subjects subject = subjectRepo.findById(id)
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found"));

        if (!subject.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to update this subject");
        }

        // Update fields
        subject.setName(subjectsDTO.getName());
        subject.setColor(subjectsDTO.getColor());

        // Save updated entity
        Subjects saved = subjectRepo.save(subject);

        return SubjectMapper.toDTO(saved);
    }

    @Override
    public void deleteSubject(Long id) {
        // Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Find the subject by id
        Subjects subject = subjectRepo.findById(id)
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found"));

        // Ensure the subject belongs to the logged-in user
        if (!subject.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You are not allowed to delete this subject");
        }

        // Delete the subject
        subjectRepo.delete(subject);
    }

}
