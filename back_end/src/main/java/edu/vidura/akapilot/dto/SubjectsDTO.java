package edu.vidura.akapilot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class SubjectsDTO {

    @NotBlank(message = "Name is mandatory")
    private String name;

    private String color;
}
