package dev.marvin.user;

public record UserResponse(
        String id,
        String firstName,
        String lastName,
        String email) {
}
