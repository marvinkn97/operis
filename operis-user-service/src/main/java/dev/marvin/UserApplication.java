package dev.marvin;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Optional;
import java.util.UUID;

@SpringBootApplication
@EnableDiscoveryClient
@EnableJpaAuditing
public class UserApplication implements AuditorAware<UUID> {
    static void main(String[] args) {
        SpringApplication.run(UserApplication.class, args);
    }

    @Bean
    public OpenAPI openAPI(Components components) {
        return new OpenAPI()
                .info(new Info()
                        .title("Operis User Service API")
                        .description("API documentation for Operis User Service")
                        .version("1.0"))
                .components(components);
    }

    @Override
    public Optional<UUID> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return Optional.of(UUID.fromString(jwtAuth.getToken().getSubject()));
        }

        return Optional.empty();
    }

}
