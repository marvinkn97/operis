package dev.marvin.project;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/projects")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Project API", description = "Operations for managing projects")
public class ProjectController {
    private final ProjectService projectService;
    private final PagedResourcesAssembler<ProjectResponse> assembler;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create a new project")
    public ResponseEntity<Void> createProject(@Valid @RequestBody ProjectRequest projectRequest, @NonNull Authentication authentication) {
        log.info("CREATE_PROJECT_REQUEST request={}", projectRequest);
        projectService.createProject(projectRequest, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get all active projects")
    public ResponseEntity<PagedModel<EntityModel<ProjectResponse>>> getProjects(
            @RequestParam(name = "pageNumber", required = false, defaultValue = "0") int pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") int pageSize,
            @NonNull Authentication authentication
    ) {
        log.info("GET_PROJECTS_REQUEST page={} size={}", pageNumber, pageSize);
        Page<ProjectResponse> page = projectService.getProjects(
                PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt")),
                authentication
        );
        return ResponseEntity.ok(assembler.toModel(page));
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get a project by its ID")
    public ResponseEntity<ProjectResponse> getProject(@Parameter @PathVariable("id") UUID projectId) {
        log.info("GET_PROJECT_REQUEST id={}", projectId);
        return ResponseEntity.ok(projectService.getProject(projectId));
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Update an existing project")
    public ResponseEntity<Void> updateProject(@Parameter @PathVariable("id") UUID projectId, @Valid @RequestBody ProjectUpdateRequest request, @NonNull Authentication authentication) {
        log.info("UPDATE_PROJECT_REQUEST id={} request={}", projectId, request);
        projectService.updateProject(request, projectId, authentication);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Delete a project")
    public ResponseEntity<Void> archiveProject(@Parameter @PathVariable("id") UUID projectId, @NonNull Authentication authentication) {
        log.info("ARCHIVE_PROJECT_REQUEST id={}", projectId);
        projectService.archiveProject(projectId, authentication);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/close")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Close a project")
    public ResponseEntity<Void> closeProject(@Parameter @PathVariable("id") UUID projectId, @NonNull Authentication authentication){
        log.info("CLOSE_PROJECT_REQUEST id={}", projectId);
        projectService.closeProject(projectId, authentication);
        return ResponseEntity.ok().build();
    }
    @PatchMapping("/{id}/members/remove")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Remove a member from a project")
    public ResponseEntity<Void> removeMember(@Parameter @PathVariable("id") UUID projectId, @RequestBody Map<String, String> body, @NonNull Authentication authentication) {
        String memberIdStr = body.get("memberId");
        if (memberIdStr == null) {
            return ResponseEntity.badRequest().build();
        }

        UUID memberId = UUID.fromString(memberIdStr);
        log.info("REMOVE_MEMBER_REQUEST projectId={} memberId={}", projectId, memberId);
        projectService.removeMember(projectId, memberId, authentication);
        return ResponseEntity.ok().build();
    }


}
