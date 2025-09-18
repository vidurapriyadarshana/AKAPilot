package edu.vidura.akapilot.dto;

import edu.vidura.akapilot.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MemoryCardsDTO {

    @NotBlank(message = "Front (question) cannot be blank")
    private String front;

    @NotBlank(message = "Back (answer) cannot be blank")
    private String back;

    @NotNull(message = "Status is required")
    private Status status;  // Enum directly in DTO

    private LocalDateTime deadline;  // Optional, can be null

    @NotNull(message = "Subject ID is required")
    private Long subjectId;  // Required for linking to a subject
}
