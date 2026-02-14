package dev.marvin.projectinvitation;

import dev.marvin.BadRequestException;
import dev.marvin.project.ProjectEntity;
import dev.marvin.project.ProjectRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectInvitationService {
    private final ProjectRepository projectRepository;
    private final ProjectInvitationRepository projectInvitationRepository;
    private final RabbitTemplate rabbitTemplate;
    private final Validator validator;

    @Value("${rabbitmq.routing.new}")
    private String newInviteRoutingKey;
    @Value("${rabbitmq.routing.accept}")
    private String acceptRoutingKey;
    @Value("${rabbitmq.routing.reject}")
    private String rejectRoutingKey;

    public void createInvitation(ProjectInvitationRequest request, Authentication authentication) {
        ProjectEntity project = projectRepository.findByIdAndArchived(request.projectId(), false)
                .orElseThrow(() -> new BadRequestException("Project with given id [%s] not found".formatted(request.projectId())));

        if (!project.getOwnerId().equals(UUID.fromString(authentication.getName()))) {
            throw new BadRequestException("Only project owner can invite members");
        }

        // Prevent self-invitation
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            String userEmail = jwtAuth.getToken().getClaimAsString("email");
            if (request.recipientEmail().equalsIgnoreCase(userEmail)) {
                throw new dev.marvin.BadRequestException("You cannot invite yourself to a project");
            }
        }

        projectInvitationRepository.findByProjectEntity_IdAndRecipientEmail(project.getId(), request.recipientEmail())
                .ifPresentOrElse(_ -> log.info("Invitation already sent for this email {}", request.recipientEmail()), () -> {
                    ProjectInvitationEntity invitation = ProjectInvitationEntity.builder()
                            .projectEntity(project)
                            .recipientName(request.recipientName())
                            .recipientEmail(request.recipientEmail())
                            .build();

                    invitation = projectInvitationRepository.saveAndFlush(invitation);
                    ProjectInvitationEvent projectInvitationEvent = new ProjectInvitationEvent(
                            request.recipientName(),
                            request.recipientEmail(),
                            project.getId(),
                            project.getName(),
                            project.getDescription(),
                            invitation.getId());

                    Set<ConstraintViolation<ProjectInvitationEvent>> violations = validator.validate(projectInvitationEvent);

                    if (!violations.isEmpty()) {
                        throw new ConstraintViolationException(violations);
                    }

                    rabbitTemplate.convertAndSend(newInviteRoutingKey, projectInvitationEvent);
                });
    }

    @Transactional
    public void acceptInvitation(UUID invitationId, Authentication authentication, UUID ctaId) {
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
        invitation.getProjectEntity().getMemberIds().add(UUID.fromString(jwtAuth.getToken().getClaimAsString("sub")));
        projectInvitationRepository.save(invitation);

        rabbitTemplate.convertAndSend(acceptRoutingKey, new ProjectInvitationResolveEvent(ctaId));
    }


    @Transactional
    public void rejectInvitation(UUID invitationId, Authentication authentication, UUID ctaId) {
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

        rabbitTemplate.convertAndSend(rejectRoutingKey, new ProjectInvitationResolveEvent(ctaId));
    }

}
