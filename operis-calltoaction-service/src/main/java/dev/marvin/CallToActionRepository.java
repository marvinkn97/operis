package dev.marvin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CallToActionRepository extends JpaRepository<CallToActionEntity, UUID> {
    Optional<CallToActionEntity> findByReferenceId(UUID referenceId);

    Optional<CallToActionEntity> findByReferenceIdAndTargetId(UUID referenceId, UUID targetId);

    @Query("""
                SELECT c FROM CallToActionEntity c
                WHERE c.status = :status
                  AND ((:userId IS NOT NULL AND c.targetId = :userId)
                       OR (:email IS NOT NULL AND c.targetEmail = :email))
            """)
    Page<CallToActionEntity> findPendingByUserIdOrEmail(@Param("userId") UUID userId, @Param("email") String email, @Param("status") CallToActionStatus status, Pageable pageable);

}
