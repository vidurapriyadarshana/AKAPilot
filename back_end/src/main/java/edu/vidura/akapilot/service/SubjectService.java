package edu.vidura.akapilot.service;

import edu.vidura.akapilot.dto.SubjectsDTO;
import edu.vidura.akapilot.entity.Subjects;

import javax.security.auth.Subject;
import java.util.List;

public interface SubjectService {
    SubjectsDTO saveSubject(SubjectsDTO subjectsDTO);
    List<SubjectsDTO> getAllSubjects();
}
