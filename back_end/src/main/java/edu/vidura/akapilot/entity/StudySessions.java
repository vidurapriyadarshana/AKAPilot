package edu.vidura.akapilot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class StudySessions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String notes;

    @ManyToOne
    private User user;

    @ManyToOne
    private Subjects subjects;

    @ManyToOne
    private Todos todos;
}
