package edu.vidura.akapilot.service;

import edu.vidura.akapilot.dto.MemoryCardsDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface MemoryCardsService {
    MemoryCardsDTO saveMemoryCards(@Valid MemoryCardsDTO memoryCardsDTO);
    List<MemoryCardsDTO> getAllMemoryCards();
}
