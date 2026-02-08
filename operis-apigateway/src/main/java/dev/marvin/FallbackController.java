package dev.marvin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.Clock;
import java.time.Instant;

@RestController
public class FallbackController {

    @GetMapping("/fallback/projects")
    public Mono<ResponseEntity<ProblemDetail>> fallbackProjects() {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.SERVICE_UNAVAILABLE);
        problem.setTitle("Project Service Unavailable");
        problem.setDetail("The project service is currently unavailable. Please try again later.");
        problem.setProperty("timestamp", Instant.now(Clock.systemUTC()));
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(problem));
    }

    @GetMapping("/fallback/users")
    public Mono<ResponseEntity<ProblemDetail>> fallbackUsers() {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.SERVICE_UNAVAILABLE);
        problem.setTitle("User Service Unavailable");
        problem.setDetail("The user service is currently unavailable. Please try again later.");
        problem.setProperty("timestamp", Instant.now(Clock.systemUTC()));
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(problem));
    }
}
