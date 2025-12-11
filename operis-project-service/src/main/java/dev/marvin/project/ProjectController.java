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
        log.info("New project request: {}", projectRequest);
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
        return ResponseEntity.ok(projectService.getProject(projectId));
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Update an existing project")
    public ResponseEntity<Void> updateProject(@Parameter @PathVariable("id") UUID projectId, @Valid @RequestBody ProjectUpdateRequest request, @NonNull Authentication authentication) {
        projectService.updateProject(request, projectId, authentication);
        return ResponseEntity.noContent().build();
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Delete a project")
    public ResponseEntity<Void> archiveProject(@Parameter @PathVariable("id") UUID projectId, @NonNull Authentication authentication) {
        projectService.archiveProject(projectId, authentication);
        return ResponseEntity.noContent().build();
    }

}
