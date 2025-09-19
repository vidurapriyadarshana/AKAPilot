package edu.vidura.akapilot.repo;

import edu.vidura.akapilot.entity.Pomodoros;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PomodoroRepo extends JpaRepository<Pomodoros , Long> {
    List<Pomodoros> findAllByStudySessions_Id(Long sessionId);
}
