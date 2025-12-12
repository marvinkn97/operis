package dev.marvin;

import lombok.Getter;

@Getter
public enum CallToActionType {
    PROJECT_INVITATION("Project Invitation"),
    TASK_ASSIGNMENT("Task Assignment");

    private final String value;

    CallToActionType(String value) {
        this.value = value;
    }
}
