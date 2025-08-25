package edu.vidura.akapilot.service;

import edu.vidura.akapilot.dto.SubjectsDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface SubjectService {
    SubjectsDTO saveSubject(SubjectsDTO subjectsDTO);
    List<SubjectsDTO> getAllSubjects();
    SubjectsDTO getSubject(Long id);
    SubjectsDTO updateSubject(Long id, @Valid SubjectsDTO subjectsDTO);
    void deleteSubject(Long id);

}
