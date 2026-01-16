package dev.marvin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Nonnull;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Users API", description = "Operations for managing users")
public class UserController {
    private final UserService userService;
    private final PagedResourcesAssembler<UserResponse> assembler;

    @GetMapping("/by-Ids")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Lookup users by IDs", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Users retrieved successfully",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
    })
    public ResponseEntity<PagedModel<EntityModel<UserResponse>>> getUsersByIds(
            @RequestParam(name = "ids") @Nonnull List<UUID> ids,
            @RequestParam(name = "pageNumber", required = false, defaultValue = "0") int pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") int pageSize) {
        log.info("User lookup requested for ids: {}", ids);
        Page<UserResponse> page = userService.getUsersByIds(ids, PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.ASC, "firstName")));
        return ResponseEntity.ok(assembler.toModel(page));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get the currently authenticated user's details,", responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User details retrieved successfully",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
    })
    public ResponseEntity<UserResponse> getAuthenticatedUserDetails(Authentication authentication) {
        log.info("Fetching details for authenticated user");
        Optional<UserResponse> authenticatedUserDetails = userService.getAuthenticatedUserDetails(authentication);
        return authenticatedUserDetails.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }


    @PreAuthorize("hasRole('USER')")
    @Operation(
            summary = "Update authenticated user's name",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Name updated successfully",
                            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
            }
    )
    @PutMapping("/me/name")
    public ResponseEntity<Void> updateMyName(@NonNull Authentication authentication, @Valid @RequestBody NameUpdateRequest request) {
        userService.updateAuthenticatedUserName(authentication, request);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('USER')")
    @Operation(
            summary = "Update authenticated user's password",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Password updated successfully")
            }
    )
    @PutMapping("/me/password")
    public ResponseEntity<Void> updateMyPassword(@NonNull Authentication authentication, @Valid @RequestBody PasswordUpdateRequest request) {
        userService.updateAuthenticatedUserPassword(authentication, request);
        return ResponseEntity.ok().build();
    }


}
