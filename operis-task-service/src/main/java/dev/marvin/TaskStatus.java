package dev.marvin;

import lombok.Getter;

@Getter
public enum TaskStatus {
    TODO("To Do"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed");

    private final String value;

    TaskStatus(String value) {
        this.value = value;
    }

}
