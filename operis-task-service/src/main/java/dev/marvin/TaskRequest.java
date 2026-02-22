package dev.marvin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record TaskRequest(
        @NotBlank
        String title,

        @NotBlank
        String description,

        @NotNull
        UUID projectId,

        @NotNull
        UUID assignedTo,

        @NotNull
        TaskPriority priority,

        @NotNull
        LocalDate dueDate
) {
}
