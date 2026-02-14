package dev.marvin;

import java.time.Instant;
import java.util.UUID;

public record CallToActionResponse(
        UUID id,
        CallToActionType type,
        String metadata,
        Instant createdAt
) {

}
