package dev.marvin.project;

import dev.marvin.ResourceNotFoundException;
import dev.marvin.user.UserResponse;
import jakarta.ws.rs.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final RestTemplate restTemplate;
//    private final UserFeignClient userFeignClient;

    private static final String PROJECT_NOT_FOUND = "Project with given id [%s] not found";

    @Transactional
    public void createProject(ProjectRequest projectRequest, Authentication authentication) {
        String ownerId =  authentication.getName();
        log.info("Creating project {} with owner {}", projectRequest, ownerId.substring(0, 4).concat("..."));
        ProjectEntity projectEntity = ProjectEntity.builder()
                .name(projectRequest.name())
                .description(projectRequest.description())
                .ownerId(ownerId)
                .memberIds(new ArrayList<>(List.of(ownerId)))
                .build();
        projectRepository.save(projectEntity);
        log.info("Project {} created", projectEntity.getName());
    }

    @Transactional
    public void updateProject(ProjectUpdateRequest projectUpdateRequest, UUID projectId, Authentication authentication) {
        log.info("Updating project {} with id {}", projectUpdateRequest, projectId);
        ProjectEntity projectEntity = projectRepository.findByIdAndArchived(projectId, false)
                .orElseThrow(() -> new ResourceNotFoundException(PROJECT_NOT_FOUND.formatted(projectId)));


        if (!projectEntity.getOwnerId().equals(authentication.getName())) {
            throw new BadRequestException("Only the project owner can modify this project");
        }

        boolean changes = false;

        if (projectUpdateRequest.name() != null && !projectUpdateRequest.name().equals(projectEntity.getName())) {
            projectEntity.setName(projectUpdateRequest.name());
            changes = true;
        }

        if (projectUpdateRequest.description() != null && !projectUpdateRequest.description().equals(projectEntity.getDescription())) {
            projectEntity.setDescription(projectUpdateRequest.description());
            changes = true;
        }

        if (!changes) {
            log.info("No current changes to {}", projectEntity.getName());
            return;
        }

        projectRepository.save(projectEntity);
        log.info("Project {} updated", projectEntity.getName());
    }

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getProjects(Pageable pageable, Authentication authentication) {
        log.info("Retrieving projects for user {}", authentication.getName());

        //make a rest call to task service to get task count for given project id
        List<UUID> activeProjectIds = projectRepository.findActiveProjectIds();


        List<ProjectResponse> projectEntities = projectRepository.findAllWithMembers(authentication.getName(), false).stream()
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt())) // latest first
                .map(projectEntity ->
                        new ProjectResponse(projectEntity.getId(), projectEntity.getName(), projectEntity.getDescription(), projectEntity.getProgressPercentage(), 0, projectEntity.getMemberIds().size()))
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), projectEntities.size());

        List<ProjectResponse> pageContent = projectEntities.subList(start, end);

        return new PageImpl<>(pageContent, pageable, projectEntities.size());
    }


    @Transactional(readOnly = true)
    public ProjectResponse getProject(UUID projectId) {
        log.info("Retrieving project with id {}", projectId);
        return projectRepository.findByIdWithMembers(projectId)
                .map(projectEntity -> {
                    List<UserResponse> members = restTemplate.getForObject("http://operis-user-service/by-ids", List.class, projectEntity.getMemberIds());

                    return new ProjectResponse(projectEntity.getId(), projectEntity.getName(), projectEntity.getDescription(), projectEntity.getProgressPercentage(), List.of(), members);
                })
                .orElseThrow(() -> new ResourceNotFoundException(PROJECT_NOT_FOUND.formatted(projectId)));
    }

    @Transactional
    public void archiveProject(UUID projectId, Authentication authentication) {
        log.info("Archiving project {}", projectId);
        ProjectEntity projectEntity = projectRepository.findByIdAndArchived(projectId, false)
                .orElseThrow(() -> new ResourceNotFoundException(PROJECT_NOT_FOUND.formatted(projectId)));

        if (!projectEntity.getOwnerId().equals(authentication.getName())) {
            throw new BadRequestException("Only the project owner can modify this project");
        }

        if (projectEntity.getTotalTasks() > projectEntity.getCompletedTasks()) {
            throw new BadRequestException("Project cannot be deleted: there are unfinished tasks");
        }

        projectEntity.setArchived(true);
        projectRepository.save(projectEntity);
        log.info("Project {} archived", projectEntity.getName());
    }


}
