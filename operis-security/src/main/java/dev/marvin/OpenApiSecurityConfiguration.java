package dev.marvin;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.Scopes;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiSecurityConfiguration {

    @Bean
    public Components commonComponents() {
        return new Components()
                .addSecuritySchemes(
                        "keycloak",
                        new SecurityScheme()
                                .in(SecurityScheme.In.HEADER)
                                .type(SecurityScheme.Type.OAUTH2)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .flows(
                                        new OAuthFlows().authorizationCode(
                                                new OAuthFlow()
                                                        .authorizationUrl("http://localhost:9090/realms/operis/protocol/openid-connect/auth")
                                                        .tokenUrl("http://localhost:9090/realms/operis/protocol/openid-connect/token")
                                                        .scopes(new Scopes()
                                                                .addString("openid", "OpenID")
                                                                .addString("profile", "Profile information")
                                                                .addString("email", "Email information")
                                                        )
                                        )
                                )
                );
    }
}
