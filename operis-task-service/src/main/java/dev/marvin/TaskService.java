package dev.marvin;

import dev.marvin.configuration.NewTaskEvent;
import dev.marvin.configuration.TaskAssignmentResolveEvent;
import dev.marvin.configuration.TaskAssignmentResolveRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {
    private final TaskRepository taskRepository;
    private final RabbitTemplate rabbitTemplate;
    private final Validator validator;

    @Value("${rabbitmq.routing-key.new}")
    private String newTaskRoutingKey;
    @Value("${rabbitmq.routing-key.accept}")
    private String acceptTaskRoutingKey;
    @Value("${rabbitmq.routing-key.reject}")
    private String rejectTaskRoutingKey;

    @Transactional
    public void createTask(TaskRequest request) {
        TaskEntity task = TaskEntity.builder()
                .title(request.title())
                .description(request.description())
                .projectId(request.projectId())
                .assignedTo(request.assignedTo())
                .priority(request.priority())
                .dueDate(request.dueDate())
                .build();

        task = taskRepository.saveAndFlush(task);

        NewTaskEvent event = new NewTaskEvent(task.getId(), task.getTitle(), task.getDescription(), task.getPriority(), task.getDueDate(), task.getProjectId(), task.getAssignedTo());

        Set<ConstraintViolation<NewTaskEvent>> violations = validator.validate(event);

        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        rabbitTemplate.convertAndSend(newTaskRoutingKey, event);
    }


    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksByProjectId(UUID projectId, Pageable pageable) {
        return taskRepository.findAllByProjectId(projectId, pageable)
                .map(taskEntity -> new TaskResponse(
                        taskEntity.getId(),
                        taskEntity.getTitle(),
                        taskEntity.getDescription(),
                        taskEntity.getDueDate(),
                        taskEntity.getPriority(),
                        taskEntity.getStatus(),
                        taskEntity.getCompletedAt(),
                        taskEntity.getAssignedTo() != null
                ));
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getAssignedTasks(Pageable pageable, Authentication authentication) {
       return taskRepository.findAllByAssignedToAndStatus(UUID.fromString(authentication.getName()), TaskStatus.IN_PROGRESS, pageable)
                .map(taskEntity -> new TaskResponse(
                        taskEntity.getId(),
                        taskEntity.getTitle(),
                        taskEntity.getDescription(),
                        taskEntity.getDueDate(),
                        taskEntity.getPriority(),
                        taskEntity.getStatus(),
                        taskEntity.getCompletedAt(),
                        taskEntity.getAssignedTo() != null
                ));
    }

    @Transactional(readOnly = true)
    public TaskStatsResponse getStats(UUID projectId) {
        int total = taskRepository.countAllByProjectId(projectId);
        int completed = taskRepository.countAllByProjectIdAndStatus(projectId, TaskStatus.COMPLETED);
        return new TaskStatsResponse(total, completed);
    }


    @Transactional
    public void acceptTaskAssignment(UUID taskId, Authentication authentication, TaskAssignmentResolveRequest request) {
        TaskEntity task = taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("Task with given id [%s] not found".formatted(taskId)));

        if (!UUID.fromString(authentication.getName()).equals(task.getAssignedTo())) {
            throw new BadRequestException("You are not assigned to this task");
        }

        task.setStatus(TaskStatus.IN_PROGRESS);
        taskRepository.save(task);

        // Only send Rabbit message after transaction commits successfully
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                rabbitTemplate.convertAndSend(acceptTaskRoutingKey, new TaskAssignmentResolveEvent(request.actionId()));
            }
        });
    }

    @Transactional
    public void rejectTaskAssignment(UUID taskId, Authentication authentication, TaskAssignmentResolveRequest request) {
        TaskEntity task = taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("Task with given id [%s] not found".formatted(taskId)));

        if (!UUID.fromString(authentication.getName()).equals(task.getAssignedTo())) {
            throw new BadRequestException("You are not assigned to this task");
        }

        task.setAssignedTo(null);
        taskRepository.save(task);

        // Only send Rabbit message after transaction commits successfully
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                rabbitTemplate.convertAndSend(rejectTaskRoutingKey, new TaskAssignmentResolveEvent(request.actionId()));
            }
        });
    }

    @Transactional
    public void markTaskCompleted(UUID taskId, Authentication authentication){
        TaskEntity task = taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("Task with given id [%s] not found".formatted(taskId)));

        if (!UUID.fromString(authentication.getName()).equals(task.getAssignedTo())) {
            throw new BadRequestException("You are not assigned to this task");
        }

        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(Instant.now());
        taskRepository.save(task);
    }

}
