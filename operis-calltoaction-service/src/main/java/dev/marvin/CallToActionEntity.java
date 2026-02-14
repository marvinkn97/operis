package dev.marvin;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;


@Entity
@Table(name = "call_to_actions")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CallToActionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Enumerated(EnumType.STRING)
    private CallToActionType type;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private CallToActionStatus status = CallToActionStatus.PENDING;
    @Enumerated(EnumType.STRING)
    private CallToActionTarget target;
    private UUID targetId;
    private String targetEmail;
    private UUID referenceId;
    @Column(columnDefinition = "TEXT")
    private String metadata; //JSON metadata for generic UI behavior
    @CreationTimestamp
    private Instant createdAt;
    @UpdateTimestamp
    private Instant updatedAt;
}

