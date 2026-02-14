package dev.marvin;

import dev.marvin.email.EmailService;
import dev.marvin.payload.ProjectInvitationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
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

    @RabbitListener(queues = "${rabbitmq.queue.notification-service}")
    public void sendProjectInvitationEmail(ProjectInvitationEvent projectInvitationEvent) {
        // Prepare Thymeleaf context
        Context context = new Context();
        context.setVariable("recipientName", projectInvitationEvent.recipientName());
        context.setVariable("projectName", projectInvitationEvent.projectName());
        context.setVariable("projectDescription", projectInvitationEvent.projectDescription());
        context.setVariable("frontendUrl", frontendUrl);

        String templateName = "project-invitation.html";

        // Render template
        String htmlBody = templateEngine.process(templateName, context);

        emailService.sendEmail(projectInvitationEvent.recipientEmail(), "Project Invitation", htmlBody);
    }
}
