package edu.vidura.akapilot.service;

import edu.vidura.akapilot.dto.StudySessionsDTO;

import java.util.List;

public interface StudySessionsService {
    StudySessionsDTO createSession(StudySessionsDTO studySessionsDTO);
    List<StudySessionsDTO> getAllSessions();
    StudySessionsDTO getSessionsById(Long id);
    StudySessionsDTO updateSession(Long id, StudySessionsDTO dto);
    void deleteSession(Long id);
}
