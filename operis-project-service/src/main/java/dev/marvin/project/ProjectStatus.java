package dev.marvin.project;

import lombok.Getter;

@Getter
public enum ProjectStatus {
    OPEN("Open"),
    COMPLETED("Completed");

    private final String value;

    ProjectStatus(String value) {
        this.value = value;
    }
}
