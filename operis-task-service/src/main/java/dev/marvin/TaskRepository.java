package dev.marvin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, UUID> {
    Page<TaskEntity> findAllByProjectId(UUID projectId, Pageable pageable);

    Page<TaskEntity> findAllByAssignedToAndStatus(UUID assignedTo, TaskStatus status, Pageable pageable);

    int countAllByProjectId(UUID projectId);

    int countAllByProjectIdAndStatus(UUID projectId, TaskStatus status);
}
