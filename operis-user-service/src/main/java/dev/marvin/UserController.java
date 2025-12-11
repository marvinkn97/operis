package dev.marvin;

import dev.marvin.user.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Users API", description = "Operations for managing users")
public class UserController {
    private final UserService userService;

    @GetMapping("/by-Ids")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Lookup users by IDs", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Users found",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
    })
    public ResponseEntity<List<UserResponse>> getUsersByIds(@RequestParam @NonNull List<String> ids) {
        log.info("User lookup requested for ids: {}", ids);
        return ResponseEntity.ok(userService.getUsersByIds(ids));
    }

}
