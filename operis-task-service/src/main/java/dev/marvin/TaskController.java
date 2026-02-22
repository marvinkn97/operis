package dev.marvin;

import dev.marvin.configuration.TaskAssignmentResolveRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/v1/tasks")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Task API", description = "Operations for managing tasks")
public class TaskController {
    private final TaskService taskService;
    private final PagedResourcesAssembler<TaskResponse> assembler;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create a new task")
    public ResponseEntity<Void> createTask(@Valid @RequestBody TaskRequest taskRequest, @NonNull Authentication authentication) {
        log.info("CREATE_TASK_REQUEST request={}", taskRequest);
        taskService.createTask(taskRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    @GetMapping("/assigned")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get assigned tasks")
    public ResponseEntity<PagedModel<EntityModel<TaskResponse>>> getAssignedTasks(
            @RequestParam(name = "pageNumber", required = false, defaultValue = "0") int pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") int pageSize,
            @NonNull Authentication authentication
    ) {
        log.info("GET_ASSIGNED_TASKS_REQUEST page={} size={}", pageNumber, pageSize);
        Page<TaskResponse> page = taskService.getAssignedTasks(
                PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt")),
                authentication
        );
        return ResponseEntity.ok(assembler.toModel(page));
    }

    @GetMapping("/{id}/stats")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get task stats for a project")
    public ResponseEntity<TaskStatsResponse> getTaskStats(@PathVariable("id") UUID projectId) {
        log.info("GET_TASK_STATS request for projectId={}", projectId);
        TaskStatsResponse stats = taskService.getStats(projectId);
        return ResponseEntity.ok(stats);
    }

    @PatchMapping("/{id}/assignment/accept")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Accept a task assignment from Action Center")
    public ResponseEntity<Void> acceptTaskAssignment(
            @PathVariable("id") UUID taskId,
            @Valid @RequestBody TaskAssignmentResolveRequest request,
            @NonNull Authentication authentication
    ) {
        log.info("ACCEPT_TASK_ASSIGNMENT taskId={} actionId={}", taskId, request.actionId());
        taskService.acceptTaskAssignment(taskId, authentication, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/assignment/reject")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Reject a task assignment from Action Center")
    public ResponseEntity<Void> rejectTaskAssignment(
            @PathVariable("id") UUID taskId,
            @Valid @RequestBody TaskAssignmentResolveRequest request,
            @NonNull Authentication authentication
    ) {
        log.info("REJECT_TASK_ASSIGNMENT taskId={} actionId={}", taskId, request.actionId());
        taskService.rejectTaskAssignment(taskId, authentication, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/projects/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get tasks by project id")
    public ResponseEntity<PagedModel<EntityModel<TaskResponse>>> getTasksByProjectId(
            @PathVariable("id") UUID projectId,
            @RequestParam(name = "pageNumber", defaultValue = "0") int pageNumber,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        log.info("GET_PROJECT_TASKS_REQUEST projectId={} page={} size={}", projectId, pageNumber, pageSize);

        Page<TaskResponse> page = taskService.getTasksByProjectId(
                projectId,
                PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        return ResponseEntity.ok(assembler.toModel(page));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Mark an assigned task as completed")
    public ResponseEntity<Void> markTaskCompleted(@PathVariable("id") UUID taskId, @NonNull Authentication authentication) {
        log.info("MARK_TASK_COMPLETED taskId={}", taskId);
        taskService.markTaskCompleted(taskId, authentication);
        return ResponseEntity.ok().build();
    }

}
