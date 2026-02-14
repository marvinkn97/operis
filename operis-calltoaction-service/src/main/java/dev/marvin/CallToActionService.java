package dev.marvin;

import dev.marvin.configuration.ProjectInvitationEvent;
import dev.marvin.configuration.ProjectInvitationResolveEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CallToActionService {
    private final CallToActionRepository callToActionRepository;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "${rabbitmq.queue.cta-service}")
    @Transactional
    public void projectInvitation(ProjectInvitationEvent projectInvitationEvent) {
        if (callToActionRepository.findByReferenceId(projectInvitationEvent.invitationId()).isPresent()) {
            return;
        }

        CallToActionEntity callToActionEntity = CallToActionEntity.builder()
                .type(CallToActionType.PROJECT_INVITATION)
                .status(CallToActionStatus.PENDING)
                .target(CallToActionTarget.USER)
                .targetEmail(projectInvitationEvent.recipientEmail())
                .referenceId(projectInvitationEvent.invitationId())
                .metadata(objectMapper.writeValueAsString(projectInvitationEvent))
                .build();
        callToActionRepository.save(callToActionEntity);
    }

    @Transactional(readOnly = true)
    public Page<CallToActionResponse> getCTAs(Pageable pageable, JwtAuthenticationToken jwtAuthenticationToken) {
        Jwt jwt = jwtAuthenticationToken.getToken();

        String userId = jwt.getClaimAsString("sub");
        String email = jwt.getClaimAsString("email");

        return callToActionRepository.findPendingByUserIdOrEmail(UUID.fromString(userId), email, CallToActionStatus.PENDING, pageable)
                .map(action -> new CallToActionResponse(action.getId(), action.getType(), action.getMetadata(), action.getCreatedAt()));
    }

    @RabbitListener(queues = "${rabbitmq.queue.cta-service}")
    public void resolveCTA(ProjectInvitationResolveEvent resolveEvent) {
        callToActionRepository.findById(resolveEvent.ctaId()).ifPresentOrElse(
                callToActionEntity -> {
                    callToActionEntity.setStatus(CallToActionStatus.COMPLETED);
                    callToActionRepository.save(callToActionEntity);
                }, () -> {
                    throw new ResourceNotFoundException("CTA with given id [%s] not found".formatted(resolveEvent.ctaId()));
                }
        );
    }

}
