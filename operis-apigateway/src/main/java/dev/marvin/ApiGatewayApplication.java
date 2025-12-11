package dev.marvin;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {
    static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public OpenAPI openAPI(Components components) {
        return new OpenAPI()
                .info(new Info()
                        .title("Operis API Gateway")
                        .description("""
                                    API Gateway for Operis microservices.
                                    This documentation aggregates all microservices endpoints including:
                                    - Project Service
                                    - User Service
                                    - Task Service
                                    All endpoints are secured via Keycloak OAuth2.
                                """)

                        .version("1.0"))
                .components(components)
                .addSecurityItem(new SecurityRequirement().addList("keycloak"));
    }

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("operis-project-service", r ->
                        r
                                .path("/api/v1/projects/**")
                                .uri("lb://operis-project-service")
                ).build();
    }
}

