package dev.marvin.notification;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailNotificationRequest(
        @NotBlank
        String recipientName,

        @Email
        @NotBlank
        String recipientEmail,

        @NotBlank
        String projectName,

        @NotBlank
        String projectDescription
) {
}
