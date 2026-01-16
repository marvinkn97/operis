package dev.marvin;

import dev.marvin.email.EmailService;
import dev.marvin.notification.EmailNotificationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final EmailService emailService;
    private final TemplateEngine templateEngine;

    @Value("${operis.frontend-url}")
    private String frontendUrl;

    public void sendProjectInvitationEmail(EmailNotificationRequest emailNotificationRequest) {
        // Prepare Thymeleaf context
        Context context = new Context();
        context.setVariable("recipientName", emailNotificationRequest.recipientName());
        context.setVariable("projectName", emailNotificationRequest.projectName());
        context.setVariable("projectDescription", emailNotificationRequest.projectDescription());
        context.setVariable("frontendUrl", frontendUrl);

        String templateName = "project-invitation.html";

        // Render template
        String htmlBody = templateEngine.process(templateName, context);

        emailService.sendEmail(emailNotificationRequest.recipientEmail(), "Project Invitation", htmlBody);
    }
}
