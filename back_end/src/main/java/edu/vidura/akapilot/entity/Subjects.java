package edu.vidura.akapilot.entity;

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

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "subjects", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MemoryCards> memoryCards;

    @OneToMany(mappedBy = "subjects", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Todos> todos;

    @OneToMany(mappedBy = "subjects", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudySessions> studySessions;
}
