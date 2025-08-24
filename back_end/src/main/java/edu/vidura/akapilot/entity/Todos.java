package edu.vidura.akapilot.entity;

import edu.vidura.akapilot.enums.Priority;
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
public class Todos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String title;
    private String description;
    private LocalDateTime dueDate;
    private boolean completed;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @ManyToOne
    private User user;

    @ManyToOne
    private Subjects subjects;

    @OneToMany(mappedBy = "todos", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudySessions> studySessions;
}
