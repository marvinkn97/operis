package dev.marvin.configuration;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record TaskAssignmentResolveRequest(
        @NotNull
        UUID actionId
) {
}
