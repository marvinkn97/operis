package dev.marvin.projectinvitation;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/projects/invitations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Project Invitation API", description = "Operations for managing project invitations")
public class ProjectInvitationController {
    private final ProjectInvitationService projectInvitationService;
}
