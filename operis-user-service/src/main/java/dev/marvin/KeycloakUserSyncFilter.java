package dev.marvin;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter extends OncePerRequestFilter {
    private final UserRepository userRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Only run on /api/v1/users/** endpoints
        String path = request.getRequestURI();
        return !path.startsWith("/api/v1/users");
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!(authentication instanceof JwtAuthenticationToken jwtAuth)) {
            filterChain.doFilter(request, response);
            return;
        }

        Jwt jwt = jwtAuth.getToken();

        String email = jwt.getClaimAsString("email");
        if (email == null || email.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        UUID userId = UUID.fromString(jwt.getSubject());

        if (userRepository.existsById(userId)) {
            log.info("User already synced {}", userId);
            filterChain.doFilter(request, response);
            return;
        }

        UserEntity user = new UserEntity();
        user.setId(userId);
        user.setEmail(email);
        user.setFirstName(jwt.getClaimAsString("given_name"));
        user.setLastName(jwt.getClaimAsString("family_name"));

        userRepository.save(user);
        log.info("User synced from Keycloak: {}", userId);

        filterChain.doFilter(request, response);
    }
}
