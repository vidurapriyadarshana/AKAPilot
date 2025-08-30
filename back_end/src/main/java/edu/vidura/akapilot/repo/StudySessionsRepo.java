package edu.vidura.akapilot.repo;

import edu.vidura.akapilot.entity.StudySessions;
import edu.vidura.akapilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudySessionsRepo extends JpaRepository<StudySessions, Long> {
    List<StudySessions> findByUser(User user);
}
