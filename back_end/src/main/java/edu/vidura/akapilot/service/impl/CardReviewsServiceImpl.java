package edu.vidura.akapilot.service.impl;

import edu.vidura.akapilot.dto.CardReviewsDTO;
import edu.vidura.akapilot.entity.CardReviews;
import edu.vidura.akapilot.entity.MemoryCards;
import edu.vidura.akapilot.entity.User;
import edu.vidura.akapilot.mapper.CardReviewsMapper;
import edu.vidura.akapilot.repo.CardReviewsRepo;
import edu.vidura.akapilot.repo.MemoryCardsRepo;
import edu.vidura.akapilot.repo.UserRepo;
import edu.vidura.akapilot.service.CardReviewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CardReviewsServiceImpl implements CardReviewsService {

    private final CardReviewsRepo cardReviewsRepo;
    private final UserRepo userRepo;
    private final MemoryCardsRepo memoryCardsRepo;

    @Override
    public CardReviewsDTO saveCardReviews(CardReviewsDTO cardReviewsDTO) {
        // Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Find memory card
        MemoryCards memoryCard = memoryCardsRepo.findById(cardReviewsDTO.getMemoryCardId())
                .orElseThrow(() -> new IllegalArgumentException("Memory card not found"));

        // Create a new review entity for each call
        CardReviews review = CardReviews.builder()
                .memoryCards(memoryCard)
                .user(user)
                .success(cardReviewsDTO.getSuccess())
                .build(); // reviewDate is auto-set by @UpdateTimestamp

        // Save new review
        CardReviews saved = cardReviewsRepo.save(review);

        return CardReviewsMapper.toDTO(saved);
    }

    @Override
    public List<CardReviewsDTO> getReviewsForLoggedInUser() {
        // Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Fetch reviews by user
        List<CardReviews> reviews = cardReviewsRepo.findByUser(user);
        return reviews.stream()
                .map(CardReviewsMapper::toDTO)
                .toList();
    }

    @Override
    public List<CardReviewsDTO> getReviewsByCardId(Long cardId) {
        MemoryCards card = memoryCardsRepo.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Memory card not found"));

        List<CardReviews> reviews = cardReviewsRepo.findByMemoryCards(card);
        return reviews.stream()
                .map(CardReviewsMapper::toDTO)
                .toList();
    }

    @Override
    public List<CardReviewsDTO> getReviewsByUserId(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<CardReviews> reviews = cardReviewsRepo.findByUser(user);
        return reviews.stream()
                .map(CardReviewsMapper::toDTO)
                .toList();
    }

    @Override
    public List<Map<String, Object>> getReviewSummary() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Object[]> summary = cardReviewsRepo.getSuccessRateAndLastReviewByUser(user.getId());

        return summary.stream().map(row -> {
            Long cardId = ((Number) row[0]).longValue();
            String cardName = (String) row[1];
            Long successCount = ((Number) row[2]).longValue();
            Long totalCount = ((Number) row[3]).longValue();

            // Handle Timestamp -> LocalDateTime conversion
            LocalDateTime lastReview;
            if (row[4] instanceof java.sql.Timestamp ts) {
                lastReview = ts.toLocalDateTime();
            } else {
                lastReview = (LocalDateTime) row[4]; // fallback
            }

            double successRate = (totalCount != 0) ? (successCount.doubleValue() / totalCount) * 100 : 0.0;

            // Use HashMap to avoid null issues with Map.of
            Map<String, Object> map = new HashMap<>();
            map.put("cardId", cardId);
            map.put("cardName", cardName);
            map.put("successRate", successRate);
            map.put("lastReview", lastReview);

            return map;
        }).toList();

    }


}
