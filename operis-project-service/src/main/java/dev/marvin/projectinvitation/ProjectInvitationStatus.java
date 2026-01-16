package dev.marvin.projectinvitation;

import lombok.Getter;

@Getter
public enum ProjectInvitationStatus {
    PENDING("Pending"),
    ACCEPTED("Accepted"),
    REJECTED("Rejected");

    private final String value;

    ProjectInvitationStatus(String value) {
        this.value = value;
    }
}
