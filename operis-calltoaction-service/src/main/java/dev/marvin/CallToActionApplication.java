package dev.marvin;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CallToActionApplication {
    static void main(String[] args) {
        SpringApplication.run(CallToActionApplication.class, args);
    }

    @Bean
    public OpenAPI openAPI(Components components) {
        return new OpenAPI()
                .info(new Info()
                        .title("Operis CTA(call to action) Service API")
                        .description("API documentation for Operis CTA Service")
                        .version("1.0"))
                .components(components);
    }
}
