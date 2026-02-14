package dev.marvin.projectinvitation;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ProjectInvitationResolveEvent(
        @NotNull
        UUID ctaId
) {}
