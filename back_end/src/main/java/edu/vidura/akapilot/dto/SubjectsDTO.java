package edu.vidura.akapilot.dto;

import edu.vidura.akapilot.enums.Difficulty;
import edu.vidura.akapilot.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SubjectsDTO {

    private Long id;

    @NotBlank(message = "Name is mandatory")
    private String name;

    private String color;

    private String description;

    private Difficulty difficulty;

    private Priority priority;
}
