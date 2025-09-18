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

}
