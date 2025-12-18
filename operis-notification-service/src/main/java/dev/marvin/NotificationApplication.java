package dev.marvin;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableDiscoveryClient
@EnableAsync
public class NotificationApplication {
    static void main(String[] args) {
        SpringApplication.run(NotificationApplication.class, args);
    }

    @Bean
    public OpenAPI openAPI(Components components) {
        return new OpenAPI()
                .info(new Info()
                        .title("Operis Notification Service API")
                        .description("API documentation for Operis Notification Service")
                        .version("1.0"))
                .components(components);
    }

    @Bean
    public CommandLineRunner runner(Environment env) {
        return args -> {
            System.out.println("spring.mail.host = " + env.getProperty("spring.mail.host"));
        };
    }


}
