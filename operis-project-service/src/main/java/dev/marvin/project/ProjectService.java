package dev.marvin.project;

import dev.marvin.BadRequestException;
import dev.marvin.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;

    private static final String PROJECT_NOT_FOUND = "Project with given id [%s] not found";

    @Transactional
    public void createProject(ProjectRequest projectRequest, Authentication authentication) {
        UUID ownerId = UUID.fromString(authentication.getName());
        log.info("Creating project {} for user {}", projectRequest, authentication.getName());
        ProjectEntity projectEntity = ProjectEntity.builder()
                .name(projectRequest.name())
                .description(projectRequest.description())
                .ownerId(ownerId)
                .memberIds(new ArrayList<>(List.of(ownerId)))
                .build();
        projectRepository.save(projectEntity);
        log.info("Project {} created", projectEntity.getId());
    }

    @Transactional
    public void updateProject(ProjectUpdateRequest projectUpdateRequest, UUID projectId, Authentication authentication) {
        log.info("Updating project {} with id {}", projectUpdateRequest, projectId);
        ProjectEntity projectEntity = projectRepository.findByIdAndArchived(projectId, false)
                .orElseThrow(() -> new ResourceNotFoundException(PROJECT_NOT_FOUND.formatted(projectId)));

        UUID ownerId = UUID.fromString(authentication.getName());

        if (!projectEntity.getOwnerId().equals(ownerId)) {
            throw new BadRequestException("Only the project owner can update this project");
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
        log.info("Project {} updated", projectEntity.getId());
    }

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getProjects(Pageable pageable, Authentication authentication) {
        log.info("Retrieving projects for user {}", authentication.getName());

        UUID ownerId = UUID.fromString(authentication.getName());
        List<ProjectResponse> projectEntities = projectRepository.findAllWithMembers(ownerId, false).stream()
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt())) // latest first
                .map(projectEntity ->
                        new ProjectResponse(projectEntity.getId(), projectEntity.getName(), projectEntity.getDescription(), projectEntity.getStatus().getValue(), projectEntity.getProgressPercentage(), projectEntity.getTotalTasks(), projectEntity.getMemberIds().size()))
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
                .map(projectEntity -> new ProjectResponse(projectEntity.getId(), projectEntity.getName(), projectEntity.getDescription(), projectEntity.getStatus().getValue(), projectEntity.getOwnerId(), projectEntity.getProgressPercentage(), projectEntity.getTotalTasks(), projectEntity.getMemberIds().size(), projectEntity.getMemberIds()))
                .orElseThrow(() -> new ResourceNotFoundException(PROJECT_NOT_FOUND.formatted(projectId)));
    }

    @Transactional
    public void archiveProject(UUID projectId, Authentication authentication) {
        log.info("Archiving project {}", projectId);
        ProjectEntity projectEntity = projectRepository.findByIdAndArchived(projectId, false)
                .orElseThrow(() -> new ResourceNotFoundException(PROJECT_NOT_FOUND.formatted(projectId)));

        UUID ownerId = UUID.fromString(authentication.getName());

        if (!projectEntity.getOwnerId().equals(ownerId)) {
            throw new BadRequestException("Only the project owner can archive this project");
        }

        if (projectEntity.getTotalTasks() > projectEntity.getCompletedTasks()) {
            throw new BadRequestException("Project cannot be deleted: there are unfinished tasks");
        }

        projectEntity.setArchived(true);
        projectRepository.save(projectEntity);
        log.info("Project {} archived", projectEntity.getId());
    }

    @Transactional
    public void closeProject(UUID projectId, Authentication authentication){
        log.info("Closing project {}", projectId);
        ProjectEntity projectEntity = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException(PROJECT_NOT_FOUND.formatted(projectId)));

        if(projectEntity.getStatus().equals(ProjectStatus.COMPLETED)){
            log.info("Project already marked as completed");
            return;
        }

        UUID ownerId = UUID.fromString(authentication.getName());

        if (!projectEntity.getOwnerId().equals(ownerId)) {
            throw new BadRequestException("Only the project owner can close this project");
        }

        int total = projectEntity.getTotalTasks();
        int completed = projectEntity.getCompletedTasks();

        log.info("Close check → totalTasks={}, completedTasks={}", total, completed);

        if (total == 0) {
            throw new BadRequestException("Project cannot be closed: no tasks defined");
        }

        if (completed != total) {
            throw new BadRequestException("Project cannot be closed: there are unfinished tasks");
        }

        projectEntity.setStatus(ProjectStatus.COMPLETED);
        projectRepository.save(projectEntity);
        log.info("Project {} closed", projectEntity.getId());
    }

    public void removeMember(UUID projectId, UUID memberId, Authentication authentication) {
        log.info("Removing member {} from project {}", memberId, projectId);
        ProjectEntity project = projectRepository.findByIdAndArchived(projectId, false)
                .orElseThrow(() -> new ResourceNotFoundException(PROJECT_NOT_FOUND.formatted(projectId)));

        UUID ownerId = UUID.fromString(authentication.getName());

        if (!project.getOwnerId().equals(ownerId)) {
            throw new BadRequestException("Only the project owner can remove members");
        }

        boolean removed = project.getMemberIds().remove(memberId);
        if (!removed) {
            throw new ResourceNotFoundException("Member not found in project");
        }

        projectRepository.save(project);
    }


}
