package dev.marvin.projectinvitation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/project-invitations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Project Invitation API", description = "Operations for managing project invitations")
public class ProjectInvitationController {
    private final ProjectInvitationService projectInvitationService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Invite a user to a project")
    public ResponseEntity<Void> inviteToProject(@Valid @RequestBody ProjectInvitationRequest request, @NonNull Authentication authentication) {
       log.info("INVITE_TO_PROJECT_REQUEST request={}", request);
        projectInvitationService.createInvitation(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Accept project invitation")
    @PreAuthorize("hasRole('USER')")
    @PatchMapping("/{id}/accept")
    public ResponseEntity<Void> acceptInvitation(@PathVariable("id") UUID invitationId, @NonNull Authentication authentication, @RequestBody Map<String, String> body) {
        log.info("ACCEPT_INVITATION_REQUEST invitationId={} body={}", invitationId, body);

        String ctaIdStr = body.get("ctaId");
        if (ctaIdStr == null) {
            return ResponseEntity.badRequest().build();
        }

        UUID ctaId = UUID.fromString(ctaIdStr);
        projectInvitationService.acceptInvitation(invitationId, authentication, ctaId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Reject project invitation")
    @PreAuthorize("hasRole('USER')")
    @PatchMapping("/{id}/reject")
    public ResponseEntity<Void> rejectInvitation(@PathVariable("id") UUID invitationId, @NonNull Authentication authentication, @RequestBody Map<String, String> body) {
       log.info("REJECT_INVITATION_REQUEST invitationId={} body={}", invitationId, body);

        String ctaIdStr = body.get("ctaId");
        if (ctaIdStr == null) {
            return ResponseEntity.badRequest().build();
        }

        UUID ctaId = UUID.fromString(ctaIdStr);
        projectInvitationService.rejectInvitation(invitationId, authentication, ctaId);
        return ResponseEntity.ok().build();
    }

}
