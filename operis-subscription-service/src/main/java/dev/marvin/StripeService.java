package dev.marvin;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StripeService {
    private final SubscriptionRepository subscriptionRepository;

    @Value("${stripe.secret-key}")
    private String secretKey;
    @Value("${stripe.price-id}")
    private String priceId;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public Session createCheckoutSession(String userId) throws Exception {
        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                        .setSuccessUrl("http://localhost:4200/projects")
                        .setCancelUrl("http://localhost:4200/upgrade")
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setPrice(priceId)
                                        .setQuantity(1L)
                                        .build()
                        )
                        .putMetadata("userId", userId) // VERY IMPORTANT
                        .build();

        // Pass UUID as Stripe idempotency key
        RequestOptions requestOptions = RequestOptions.builder()
                .setIdempotencyKey(UUID.randomUUID().toString())
                .build();

       return Session.create(params, requestOptions);
    }
}
