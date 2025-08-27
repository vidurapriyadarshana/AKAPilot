package edu.vidura.akapilot.service.impl;

import edu.vidura.akapilot.dto.MemoryCardsDTO;
import edu.vidura.akapilot.entity.MemoryCards;
import edu.vidura.akapilot.entity.Subjects;
import edu.vidura.akapilot.entity.User;
import edu.vidura.akapilot.exception.MemoryCardNotFoundException;
import edu.vidura.akapilot.exception.OperationNotAllowedException;
import edu.vidura.akapilot.exception.ResourceNotFoundException;
import edu.vidura.akapilot.exception.SubjectNotFoundException;
import edu.vidura.akapilot.mapper.MemoryCardsMapper;
import edu.vidura.akapilot.repo.MemoryCardsRepo;
import edu.vidura.akapilot.repo.SubjectRepo;
import edu.vidura.akapilot.repo.UserRepo;
import edu.vidura.akapilot.service.MemoryCardsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemoryCardsServiceImpl implements MemoryCardsService {

    private final MemoryCardsRepo memoryCardsRepo;
    private final SubjectRepo subjectRepo;
    private final UserRepo userRepo;
    
    @Override
    public MemoryCardsDTO saveMemoryCards(MemoryCardsDTO memoryCardsDTO) {

        // 1. Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Fetch subject
        Subjects subject = subjectRepo.findById(memoryCardsDTO.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + memoryCardsDTO.getSubjectId()));

        // ✅ Optional check: Ensure subject belongs to current user
        if (!subject.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You do not own this subject");
        }

        // 3. Map DTO → Entity
        MemoryCards memoryCards = MemoryCardsMapper.toEntity(memoryCardsDTO, subject);

        // 4. Save
        MemoryCards saved = memoryCardsRepo.save(memoryCards);

        // 5. Map Entity → DTO
        return MemoryCardsMapper.toDTO(saved);
    }

    @Override
    public List<MemoryCardsDTO> getAllMemoryCards() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<MemoryCards> cards = memoryCardsRepo.findAllBySubjects_User(user);

        return cards.stream()
                .map(MemoryCardsMapper::toDTO)
                .toList();
    }

    @Override
    public MemoryCardsDTO updateMemoryCards(Long id, MemoryCardsDTO memoryCardsDTO) {
        MemoryCards memoryCard = memoryCardsRepo.findById(id)
                .orElseThrow(() -> new MemoryCardNotFoundException("Memory card not found with id: " + id));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!memoryCard.getSubjects().getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You do not own this subject");
        }

        // ✅ merge DTO into existing entity
        MemoryCardsMapper.merge(memoryCardsDTO, memoryCard);

        MemoryCards saved = memoryCardsRepo.save(memoryCard);
        return MemoryCardsMapper.toDTO(saved);
    }

    @Override
    public void deleteMemoryCards(Long id) {
        MemoryCards memoryCard = memoryCardsRepo.findById(id)
                .orElseThrow(() -> new MemoryCardNotFoundException("Memory card not found with id: " + id));

        // ✅ Ensure only the owner can delete
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!memoryCard.getSubjects().getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You do not own this memory card");
        }

        memoryCardsRepo.delete(memoryCard);
    }

    @Override
    public MemoryCardsDTO getMemoryCardsById(Long id) {
        MemoryCards memoryCard = memoryCardsRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Memory card not found with id: " + id));

        // ✅ Ensure only the owner can access
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!memoryCard.getSubjects().getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You do not own this memory card");
        }

        return MemoryCardsMapper.toDTO(memoryCard);
    }
}
