package dev.marvin;

import dev.marvin.user.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    public List<UserResponse> getUsersByIds(List<String> ids) {
        return userRepository.findAllById(ids)
                .stream()
                .map(userEntity -> new  UserResponse(userEntity.getId(), userEntity.getFirstName(), userEntity.getLastName(), userEntity.getEmail()))
                .toList();
    }
}
