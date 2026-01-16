package dev.marvin.projectinvitation;

import dev.marvin.project.ProjectEntity;
import dev.marvin.project.ProjectRepository;
import jakarta.ws.rs.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectInvitationService {
    private final ProjectRepository projectRepository;
    private final ProjectInvitationRepository projectInvitationRepository;

    @Transactional
    public void createInvitation(ProjectInvitationRequest request, Authentication authentication) {
        ProjectEntity project = projectRepository.findByIdAndArchived(request.projectId(), false)
                .orElseThrow(() -> new IllegalArgumentException("Project with given id [%s] not found".formatted(request.projectId())));

        if (!project.getOwnerId().equals(UUID.fromString(authentication.getName()))) {
            throw new BadRequestException("Only project owner can invite members");
        }

        projectInvitationRepository.findByProjectEntity_IdAndRecipientEmail(project.getId(), request.recipientEmail())
                .ifPresentOrElse(_ -> log.info("Invitation already sent for this email {}", request.recipientEmail()), () -> {
                    ProjectInvitationEntity invitation = ProjectInvitationEntity.builder()
                            .projectEntity(project)
                            .recipientName(request.recipientName())
                            .recipientEmail(request.recipientEmail())
                            .build();

                    projectInvitationRepository.save(invitation);

                    // publish event - > consumer -> notification, callToAction...

                    /*
                    Metadata
                    1. Project - name, description
                    2. Recipient - name, email
                    * */

                });
    }

    @Transactional
    public void acceptInvitation(UUID invitationId, Authentication authentication) {
        ProjectInvitationEntity invitation = projectInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new BadRequestException("Invitation with given id [%s] not found".formatted(invitationId)));

        if (invitation.getStatus() != ProjectInvitationStatus.PENDING) return; // idempotent

        JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;

        String email = jwtAuth.getToken().getClaimAsString("email");

        if (!email.equalsIgnoreCase(invitation.getRecipientEmail())) {
            log.info(
                    "Invitation acceptance denied. User email [{}] does not match invitation email [{}]",
                    email,
                    invitation.getRecipientEmail()
            );
            throw new BadRequestException("Invitation does not belong to authenticated user");
        }


        invitation.setAcceptedAt(Instant.now());
        invitation.setStatus(ProjectInvitationStatus.ACCEPTED);
        projectInvitationRepository.save(invitation);
    }


    @Transactional
    public void rejectInvitation(UUID invitationId, Authentication authentication) {
        ProjectInvitationEntity invitation = projectInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new BadRequestException("Invitation with given id [%s] not found".formatted(invitationId)));

        if (invitation.getStatus() != ProjectInvitationStatus.PENDING) return; // idempotent

        JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;

        String email = jwtAuth.getToken().getClaimAsString("email");

        if (!email.equalsIgnoreCase(invitation.getRecipientEmail())) {
            log.info(
                    "Invitation rejection denied. User email [{}] does not match invitation email [{}]",
                    email,
                    invitation.getRecipientEmail()
            );
            throw new BadRequestException("Invitation does not belong to authenticated user");
        }


        invitation.setRejectedAt(Instant.now());
        invitation.setStatus(ProjectInvitationStatus.REJECTED);
        projectInvitationRepository.save(invitation);
    }

}
