package dev.marvin.notification;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(value = "notification-service", path = "api/v1/notifications")
public interface NotificationClient {

    @PostMapping("/email/project-invitation")
    void sendProjectInvitationEmail(EmailNotificationRequest emailNotificationRequest);
}
