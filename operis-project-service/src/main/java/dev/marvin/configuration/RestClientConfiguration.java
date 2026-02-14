package dev.marvin.configuration;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfiguration {
    @LoadBalanced
    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .requestInitializer(request -> {
                    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                    if (auth instanceof JwtAuthenticationToken jwtAuth) {
                        request.getHeaders()
                                .setBearerAuth(jwtAuth.getToken().getTokenValue());
                    }
                })
                .build();
    }
}
