package edu.vidura.akapilot.repo;

import edu.vidura.akapilot.entity.CardReviews;
import edu.vidura.akapilot.entity.Subjects;
import edu.vidura.akapilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardReviewsRepo extends JpaRepository<CardReviews, Long> {
    List<Subjects> findAllByUser(User user);
}
