package dev.marvin.configuration;

import lombok.Getter;

@Getter
public enum TaskPriority {
    HIGH("High"),
    MEDIUM("Medium"),
    LOW("Low");

    private final String value;

    TaskPriority(String value) {
        this.value = value;
    }
}
