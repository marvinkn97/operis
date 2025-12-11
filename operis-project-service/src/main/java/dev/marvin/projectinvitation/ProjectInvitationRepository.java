package dev.marvin.projectinvitation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectInvitationRepository extends JpaRepository<ProjectInvitationEntity, UUID> {
    Optional<ProjectInvitationEntity> findByProjectEntity_IdAndEmail(UUID projectEntityId, String email);
}
