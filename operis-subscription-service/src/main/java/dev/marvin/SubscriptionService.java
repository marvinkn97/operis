package dev.marvin;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;

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
}
