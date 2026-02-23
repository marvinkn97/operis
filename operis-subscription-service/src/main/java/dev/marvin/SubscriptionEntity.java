package dev.marvin;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscriptions")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class SubscriptionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private UUID userId;  // Business identity (who owns the subscription)
    private String stripeCustomerId;
    private String stripeCheckoutSessionId;
    private String stripeSubscriptionId;
    @Enumerated(EnumType.STRING)
    private SubscriptionPlan plan; // FREE, PREMIUM
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @Builder.Default
    private Boolean active = false;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(insertable = false)
    private Instant updatedAt;
}
