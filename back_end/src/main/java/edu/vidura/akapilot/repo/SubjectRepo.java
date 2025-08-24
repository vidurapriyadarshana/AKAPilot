package edu.vidura.akapilot.repo;

import edu.vidura.akapilot.entity.Subjects;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepo extends JpaRepository<Subjects,Long> {

}
