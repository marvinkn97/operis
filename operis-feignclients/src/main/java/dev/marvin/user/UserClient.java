package dev.marvin.user;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(value = "user-service", path = "api/v1/users")
public interface UserClient {
    @GetMapping("/by-Ids")
    List<UserResponse> getUsersByIds(@RequestParam List<Long> ids);
}
