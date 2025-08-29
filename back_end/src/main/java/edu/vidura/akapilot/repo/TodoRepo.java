package edu.vidura.akapilot.repo;

import edu.vidura.akapilot.entity.Todos;
import edu.vidura.akapilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoRepo extends JpaRepository<Todos , Long> {
    List<Todos> findByUser(User user);
}
