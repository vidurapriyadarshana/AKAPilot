package edu.vidura.akapilot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Pomodoros {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private int durationMinutes;
    private int breakMinutes;
    private boolean completed;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    private StudySessions studySessions;
}
