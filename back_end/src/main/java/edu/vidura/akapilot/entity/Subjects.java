package edu.vidura.akapilot.entity;

import edu.vidura.akapilot.enums.Difficulty;
import edu.vidura.akapilot.enums.Priority;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Subjects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String color;
    private String description;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "subjects", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MemoryCards> memoryCards;

    @OneToMany(mappedBy = "subjects", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Todos> todos;

    @OneToMany(mappedBy = "subjects", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudySessions> studySessions;

    @OneToMany(mappedBy = "subjects", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pomodoros> pomodoros;
}
