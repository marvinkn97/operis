package dev.marvin.project;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Project Update Request", description = "Request payload for updating a project")
public record ProjectUpdateRequest(
        @Schema(description = "Name of the project", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "New Project")
        String name,

        @Schema(description = "Description of the project", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "This is a sample project.")
        String description
) {
}
