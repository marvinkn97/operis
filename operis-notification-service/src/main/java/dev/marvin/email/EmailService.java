package dev.marvin.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender javaMailSender;

    @Value("${operis.notifications.email.from}")
    private String fromEmail;

    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            log.info("Build email");
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // true = HTML
            helper.setFrom(fromEmail);

            javaMailSender.send(message);
            log.info("Email sent to {}", to);

        } catch (MessagingException e) {
            log.error("Failed to send email to {}", to, e);
            throw new IllegalStateException("Failed to send email", e);
        }
    }
}
