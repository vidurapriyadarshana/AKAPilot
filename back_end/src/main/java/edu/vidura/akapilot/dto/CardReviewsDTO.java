package edu.vidura.akapilot.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CardReviewsDTO {

    // Optional: set by DB after save
    private Long id;

    // Optional: auto-set by DB
    private LocalDateTime reviewDate;

    // Required
    @NotNull(message = "Success flag is required")
    private Boolean success;

    // Required: must link to a memory card
    @NotNull(message = "MemoryCardId is required")
    private Long memoryCardId;

    // Optional: resolved from SecurityContext
    private Long userId;
}
