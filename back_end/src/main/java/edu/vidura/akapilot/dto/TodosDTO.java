package edu.vidura.akapilot.dto;

import edu.vidura.akapilot.enums.Priority;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TodosDTO {

    private  Long id;

    @NotBlank(message = "Title is mandatory")
    private String title;

    private String description;

    @FutureOrPresent(message = "Due date must be today or in the future")
    private LocalDateTime dueDate;

    private boolean completed;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;
}
