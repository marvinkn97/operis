package dev.marvin.project;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(name = "Project Request", description = "Request payload for creating a project")
public record ProjectRequest(
        @Schema(description = "Name of the project", requiredMode = Schema.RequiredMode.REQUIRED, example = "New Project")
        @NotBlank String name,

        @Schema(description = "Description of the project", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "This is a sample project.")
        String description) {
}
