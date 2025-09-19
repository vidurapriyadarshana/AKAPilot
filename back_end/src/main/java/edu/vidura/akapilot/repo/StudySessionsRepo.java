package edu.vidura.akapilot.repo;

import edu.vidura.akapilot.entity.StudySessions;
import edu.vidura.akapilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface StudySessionsRepo extends JpaRepository<StudySessions, Long> {
    List<StudySessions> findByUser(User user);

    List<StudySessions> findAllByUser_IdAndStartTimeBetween(Long userId, LocalDateTime startTimeAfter, LocalDateTime startTimeBefore);

    @Query("""
                SELECT s.subjects.id, s.subjects.name, s.startTime, s.endTime
                FROM StudySessions s
                WHERE s.user.id = :userId
            """)
    List<Object[]> findSessionsWithSubject(@Param("userId") Long userId);
}
