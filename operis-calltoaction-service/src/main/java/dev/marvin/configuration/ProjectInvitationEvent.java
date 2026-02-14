package dev.marvin.configuration;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ProjectInvitationEvent(
        @NotBlank
        String recipientName,

        @Email
        @NotBlank
        String recipientEmail,

        @NotNull
        UUID projectId,

        @NotBlank
        String projectName,

        @NotBlank
        String projectDescription,

        @NotNull
        UUID invitationId
) {
}
