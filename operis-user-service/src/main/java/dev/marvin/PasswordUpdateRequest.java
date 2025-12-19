package dev.marvin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordUpdateRequest(
        @NotBlank
        @Size(min = 8)
        String newPassword
) {}
