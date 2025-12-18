package dev.marvin;

import lombok.Getter;

@Getter
public enum TaskStatus {
    TODO("To Do");

    private final String value;

    TaskStatus(String value) {
        this.value = value;
    }

}
