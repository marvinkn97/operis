package dev.marvin;

import org.jspecify.annotations.NonNull;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, JwtAuthenticationToken> {
    @Override
    public JwtAuthenticationToken convert(@NonNull Jwt jwt) {
        return new JwtAuthenticationToken(jwt,
                Stream.concat(new JwtGrantedAuthoritiesConverter().convert(jwt).stream(),
                extractRealmRoles(jwt).stream())
                .collect(Collectors.toSet()));
    }

    private Collection<? extends GrantedAuthority> extractRealmRoles(Jwt jwt) {
        // Get realm_access claim
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        if (realmAccess == null || !realmAccess.containsKey("roles")) {
            return Collections.emptyList(); // No roles
        }

        // Map each role to Spring ROLE_ format
        List<String> roles = (List<String>) realmAccess.get("roles");
        return roles.stream()
                .map(role -> "ROLE_" + role)  // e.g., "ADMIN" -> "ROLE_ADMIN"
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
