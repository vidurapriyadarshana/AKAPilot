package edu.vidura.akapilot.entity;

import edu.vidura.akapilot.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MemoryCards {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String front;
    private String back;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime deadline;

    @CreationTimestamp               // set once when row is first inserted
    private LocalDateTime createdAt;

    @UpdateTimestamp                 // updated every time row is updated
    private LocalDateTime updatedAt;

    @ManyToOne
    private Subjects subjects;

    @OneToMany(mappedBy = "memoryCards", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CardReviews> cardReviews;
}
