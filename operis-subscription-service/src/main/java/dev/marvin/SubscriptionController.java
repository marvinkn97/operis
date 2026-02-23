package dev.marvin;

import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("api/v1/subscriptions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Subscription API", description = "Operations for managing subscriptions")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

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


    @PostMapping("/stripe/webhook")
    public ResponseEntity<String> handleStripeWebhook(HttpServletRequest request) {
        try {
            // 1. Read the RAW bytes directly from the request stream
            String payload = StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8);
            String sigHeader = request.getHeader("Stripe-Signature");

            log.info("WEBHOOK RECEIVED! Payload length: {}", payload.length());

            // 2. Verify the signature
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

            log.info("✅ SIGNATURE VERIFIED! Event Type: {}", event.getType());

            if ("checkout.session.completed".equals(event.getType())) {
                EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
                Session session = null;

                // STRATEGY: Try safe deserialization first
                if (deserializer.getObject().isPresent()) {
                    session = (Session) deserializer.getObject().get();
                } else {
                    // FALLBACK: Use raw data if versions differ but structure is likely same
                    log.warn("Version mismatch detected. Using raw data object for session.");
                    session = (Session) event.getData().getObject();
                }

                if (session != null) {
                    log.info("🎯 Processing Session: {}", session.getId());
                    subscriptionService.handleCheckoutSessionCompleted(session);
                }
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // 3. LOG THE ACTUAL ERROR MESSAGE
            log.error("❌ WEBHOOK ERROR: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook Error");
        }
    }
}
