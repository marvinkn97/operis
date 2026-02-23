package dev.marvin;

import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final StripeService stripeService;

    @Transactional(readOnly = true)
    public boolean isPremiumUser(Authentication authentication) {
        return subscriptionRepository.findByUserIdAndActive(UUID.fromString(authentication.getName()), true)
                .map(sub -> sub.getPlan().equals(SubscriptionPlan.PREMIUM))
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public SubscriptionPlan getUserPlan(Authentication authentication) {
        return subscriptionRepository.findByUserIdAndActive(UUID.fromString(authentication.getName()), true)
                .map(SubscriptionEntity::getPlan)
                .orElse(SubscriptionPlan.FREE);
    }

    @Transactional(rollbackFor = Exception.class)
    public CheckoutResponse createCheckoutSession(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());

        try {
            Session session = stripeService.createCheckoutSession(userId.toString());
            log.info("Checkout session created for userId={} sessionId={}", userId, session.getId());
            log.info("Stripe Checkout Url: {}", session.getUrl());

            // Create new subscription row for this checkout
            SubscriptionEntity newSubscription = SubscriptionEntity.builder()
                    .userId(userId)
                    .stripeCheckoutSessionId(session.getId())
                    .plan(SubscriptionPlan.PREMIUM)
                    .active(false)
                    .build();
            subscriptionRepository.save(newSubscription);


            return new CheckoutResponse(session.getUrl());
        } catch (Exception e) {
            throw new RuntimeException("Failed to create checkout session", e);
        }
    }

    @Transactional
    public void handleCheckoutSessionCompleted(Session session) {
        UUID userId = UUID.fromString(session.getMetadata().get("userId"));
        String checkoutSessionId = session.getId();        // cs_...
        String stripeSubscriptionId = session.getSubscription(); // sub_...

        // Find the subscription row by checkout session ID
        Optional<SubscriptionEntity> subscriptionOpt = subscriptionRepository
                .findByStripeCheckoutSessionId(checkoutSessionId);

        if (subscriptionOpt.isEmpty()) {
            log.warn("No subscription found for checkoutSessionId={}", checkoutSessionId);
            return;
        }

        SubscriptionEntity subscription = subscriptionOpt.get();

        // Simple idempotency: skip if already active
        if (Boolean.TRUE.equals(subscription.getActive())) {
            log.info("Subscription already active for checkoutSessionId={}", checkoutSessionId);
            return;
        }

        // Deactivate existing active subscriptions for this user
        subscriptionRepository.findByUserIdAndActive(userId, true)
                .ifPresent(activeSub -> {
                    activeSub.setActive(false);
                    subscriptionRepository.save(activeSub);
                });

        // Activate this subscription
        subscription.setActive(true);
        subscription.setStripeSubscriptionId(stripeSubscriptionId);
        subscription.setStartDate(LocalDateTime.now());
        subscription.setEndDate(LocalDateTime.now().plusMonths(1)); // single-plan MVP
        subscriptionRepository.save(subscription);

        log.info("✅ Activated subscription for userId={} subscriptionId={} stripeSubscriptionId={}",
                userId, subscription.getId(), stripeSubscriptionId);
    }
}
