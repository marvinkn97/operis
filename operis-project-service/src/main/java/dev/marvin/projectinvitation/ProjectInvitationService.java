package dev.marvin.projectinvitation;

import dev.marvin.ResourceNotFoundException;
import dev.marvin.project.ProjectEntity;
import dev.marvin.project.ProjectRepository;
import jakarta.ws.rs.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectInvitationService {
    private final ProjectRepository projectRepository;
    private final ProjectInvitationRepository projectInvitationRepository;

    @Transactional
    public void createInvitation(UUID projectId, String email, Authentication authentication) {
        ProjectEntity project = projectRepository.findByIdAndArchived(projectId, false)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        if (!project.getOwnerId().equals(authentication.getName())) {
            throw new IllegalStateException("Only project owner can invite members");
        }

        projectInvitationRepository.findByProjectEntity_IdAndEmail(project.getId(), email)
                .ifPresent(invitation -> {
                    throw new BadRequestException("Invitation already exists for this email");
                });

        ProjectInvitationEntity invitation = ProjectInvitationEntity.builder()
                .projectEntity(project)
                .email(email)
                .build();

        projectInvitationRepository.save(invitation);

        // sendNotification(email, project.getName());

    }


    @Transactional
    public void acceptInvitation(UUID invitationId, String userEmail) {
        ProjectInvitationEntity invitation = projectInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        if(invitation.getStatus() != ProjectInvitationStatus.PENDING) return; // idempotent

        if (!invitation.getEmail().equalsIgnoreCase(userEmail)) {
            throw new IllegalStateException("Invitation email mismatch");
        }

        invitation.setStatus(ProjectInvitationStatus.ACCEPTED);
        projectInvitationRepository.save(invitation);
    }

    @Transactional
    public void rejectInvitation(UUID invitationId, String userEmail) {
        ProjectInvitationEntity invitation = projectInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        if(invitation.getStatus() != ProjectInvitationStatus.PENDING) return; // idempotent

        if (!invitation.getEmail().equalsIgnoreCase(userEmail)) {
            throw new IllegalStateException("Invitation email mismatch");
        }

        invitation.setStatus(ProjectInvitationStatus.REJECTED);
        projectInvitationRepository.save(invitation);

    }
}
