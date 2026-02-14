package dev.marvin.configuration;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ProjectInvitationResolveEvent(
        @NotNull
        UUID ctaId
) {}
