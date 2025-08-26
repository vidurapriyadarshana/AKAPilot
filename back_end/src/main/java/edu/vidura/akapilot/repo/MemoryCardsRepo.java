package edu.vidura.akapilot.repo;

import edu.vidura.akapilot.entity.MemoryCards;
import edu.vidura.akapilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemoryCardsRepo extends JpaRepository<MemoryCards , Long> {
    List<MemoryCards> findAllBySubjects_User(User user);
}
