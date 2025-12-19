package dev.marvin;

import dev.marvin.user.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final KeycloakAdminClientService keycloakAdminClientService;

    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByIds(List<UUID> ids) {
        return userRepository.findAllById(ids)
                .stream()
                .map(userEntity -> new UserResponse(userEntity.getId(), userEntity.getFirstName(), userEntity.getLastName(), userEntity.getEmail()))
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<UserResponse> getAuthenticatedUserDetails(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return userRepository.findById(userId)
                .map(userEntity -> new UserResponse(userEntity.getId(), userEntity.getFirstName(), userEntity.getLastName(), userEntity.getEmail()));
    }

    @Transactional
    public void updateAuthenticatedUserName(Authentication authentication, NameUpdateRequest request) {
        String userId = authentication.getName();
        UserRepresentation userRepresentation = keycloakAdminClientService.updateUserName(userId, request.firstName(), request.lastName());

        userRepository.findById(UUID.fromString(userId)).ifPresentOrElse((userEntity) -> {
            boolean changes = false;
            if (!userRepresentation.getFirstName().equals(userEntity.getFirstName())) {
                userEntity.setFirstName(userRepresentation.getFirstName());
                changes = true;
            }

            if (!userRepresentation.getLastName().equals(userEntity.getLastName())) {
                userEntity.setLastName(userRepresentation.getLastName());
                changes = true;
            }

            if (!changes) {
                log.info("No data changes found");
            }

            userRepository.save(userEntity);
        }, () -> {
            throw new ResourceNotFoundException("User with given id [%s] not found".formatted(UUID.fromString(userId)));
        });

    }

    @Transactional(readOnly = true)
    public void updateAuthenticatedUserPassword(Authentication authentication, PasswordUpdateRequest request) {
        String userId = authentication.getName();
        keycloakAdminClientService.resetPassword(userId, request.newPassword());
        log.info("Password updated for user {}", userId);


    }

}
