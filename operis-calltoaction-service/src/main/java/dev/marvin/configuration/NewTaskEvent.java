package dev.marvin.configuration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record NewTaskEvent(
        @NotNull
        UUID taskId,

        @NotBlank
        String title,

        @NotBlank
        String description,

        @NotNull
        TaskPriority priority,

        @NotNull
        LocalDate dueDate,

        @NotNull
        UUID projectId,

        @NotNull
        UUID assignedTo
) {
}
