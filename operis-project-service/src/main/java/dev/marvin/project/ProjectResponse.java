package dev.marvin.project;

import com.fasterxml.jackson.annotation.JsonInclude;
import dev.marvin.user.TaskResponse;
import dev.marvin.user.UserResponse;

import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProjectResponse(
        UUID id,
        String name,
        String description,
        Integer progressPercentage,
        Integer taskCount,
        Integer memberCount,
        List<TaskResponse> tasks,
        List<UserResponse> members) {

    public ProjectResponse(UUID id, String name, String description, Integer progressPercentage, Integer taskCount, Integer memberCount) {
        this(id, name, description, progressPercentage, taskCount, memberCount, null, null);
    }

    public ProjectResponse(UUID id, String name, String description, Integer progressPercentage, List<TaskResponse> tasks, List<UserResponse> members) {
        this(id, name, description, progressPercentage, null, null, tasks, members);
    }
}
