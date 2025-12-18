package dev.marvin;

import dev.marvin.user.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    public List<UserResponse> getUsersByIds(List<UUID> ids) {
        return userRepository.findAllById(ids)
                .stream()
                .map(userEntity -> new UserResponse(userEntity.getId(), userEntity.getFirstName(), userEntity.getLastName(), userEntity.getEmail()))
                .toList();
    }

    public Optional<UserResponse> getAuthenticatedUserDetails(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return userRepository.findById(userId)
                .map(userEntity -> new UserResponse(userEntity.getId(), userEntity.getFirstName(), userEntity.getLastName(), userEntity.getEmail()));
    }
}
