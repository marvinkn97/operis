package dev.marvin;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/subscriptions")
@RequiredArgsConstructor
@Slf4j
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get current user subscription plan")
    public ResponseEntity<SubscriptionPlanResponse> getMyPlan(@NonNull Authentication authentication) {
        log.info("GET_MY_SUBSCRIPTION userId={}", authentication.getName());
        SubscriptionPlan plan = subscriptionService.getUserPlan(authentication);
        return ResponseEntity.ok(new SubscriptionPlanResponse(plan));
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create Stripe checkout session for premium subscription")
    public ResponseEntity<CheckoutResponse> createCheckoutSession(
            @NonNull Authentication authentication
    ) {
        log.info("CREATE_CHECKOUT_SESSION_REQUEST user={}", authentication.getName());
        CheckoutResponse response = subscriptionService.createCheckoutSession(authentication);
        return ResponseEntity.ok(response);
    }
}
