package dev.marvin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class TaskApplication {
    static void main(String[] args) {
        SpringApplication.run(TaskApplication.class, args);
    }

    @Bean
    public OpenAPI openAPI(Components components) {
        return new OpenAPI()
                .info(new Info()
                        .title("Operis Project Task API")
                        .description("API documentation for Operis Tasl Service")
                        .version("1.0"))
                .components(components)
                .addSecurityItem(new SecurityRequirement().addList("keycloak"));
    }
}
