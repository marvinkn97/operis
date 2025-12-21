package dev.marvin.project;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProjectResponse(
        UUID id,
        String name,
        String description,
        UUID ownerId,
        Integer progressPercentage,
        Integer taskCount,
        Integer memberCount,
        List<UUID> memberIds) {

    public ProjectResponse(UUID id, String name, String description, Integer progressPercentage, Integer taskCount, Integer memberCount) {
        this(id, name, description, null, progressPercentage, taskCount, memberCount, null);
    }
}
