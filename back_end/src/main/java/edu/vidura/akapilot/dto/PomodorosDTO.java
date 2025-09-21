package edu.vidura.akapilot.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PomodorosDTO {

    private Long id; // optional

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer durationMinutes;

    @NotNull(message = "Break time is required")
    @Min(value = 1, message = "Break must be at least 1 minute")
    private Integer breakMinutes;

    @NotNull(message = "Completed status is required")
    private Boolean completed;

    private LocalDateTime createdAt;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;
}
