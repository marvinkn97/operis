package dev.marvin;

import dev.marvin.notification.EmailNotificationRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/notifications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Notification API", description = "Operations for sending notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping("/email/project-inivitation")
    @Operation(summary = "Send an email notification")
    public ResponseEntity<Void> sendProjectInvitationEmail(@Valid @RequestBody EmailNotificationRequest emailNotificationRequest) {
        log.info("Sending email to {}", emailNotificationRequest.recipientEmail());
        notificationService.sendProjectInvitationEmail(emailNotificationRequest);
        return ResponseEntity.ok().build();
    }
}
