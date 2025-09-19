package edu.vidura.akapilot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudySummaryDTO {
    private Long subjectId;
    private String subjectName;
    private Long totalStudyMinutes;
}
