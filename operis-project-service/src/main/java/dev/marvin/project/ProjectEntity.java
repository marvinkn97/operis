package dev.marvin.project;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "projects")
public class ProjectEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "project_members", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "member_id", nullable = false)
    private List<UUID> memberIds = new ArrayList<>();

    @Builder.Default
    private Integer totalTasks = 0;

    @Builder.Default
    private Integer completedTasks = 0;

    @Builder.Default
    private Boolean archived = false;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(insertable = false)
    private Instant updatedAt;

    @CreatedBy
    @Column(updatable = false, nullable = false)
    private UUID createdBy;

    @LastModifiedBy
    @Column(insertable = false)
    private UUID updatedBy;

    public void addMember(UUID memberId) {
        if (!memberIds.contains(memberId)) {
            memberIds.add(memberId);
        }
    }

    @Transient
    public Integer getProgressPercentage() {
        if (totalTasks == 0 || completedTasks == 0) return 0;
        return (int) Math.round(((double) completedTasks / totalTasks) * 100);
    }

}
