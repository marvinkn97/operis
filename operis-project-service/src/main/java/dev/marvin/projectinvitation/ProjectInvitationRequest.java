package dev.marvin.projectinvitation;

import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record ProjectInvitationRequest(
        @Nonnull
        UUID projectId,

        @NotBlank
        String recipientName,

        @NotBlank
        @Email
        String recipientEmail
) {
}
