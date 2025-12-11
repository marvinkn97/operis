package dev.marvin;

public record CallToActionResponse(
        String title,
        CallToActionType type,
        String description,
        CallToActionStatus status
) {

}
