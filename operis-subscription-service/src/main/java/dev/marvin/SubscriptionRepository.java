package dev.marvin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity, UUID> {
    Optional<SubscriptionEntity> findByUserIdAndActive(UUID userId, Boolean active);

    boolean existsByUserIdAndActive(UUID userId, Boolean active);
}
