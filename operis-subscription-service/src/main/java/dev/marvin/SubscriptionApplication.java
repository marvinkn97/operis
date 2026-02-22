package dev.marvin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
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
public class SubscriptionApplication implements AuditorAware<UUID> {
    static void main(String[] args){
        SpringApplication.run(SubscriptionApplication.class, args);
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
