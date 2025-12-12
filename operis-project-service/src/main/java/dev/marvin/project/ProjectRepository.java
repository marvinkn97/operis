package dev.marvin.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {
    @Query("""
                SELECT DISTINCT p
                FROM ProjectEntity p
                LEFT JOIN FETCH p.memberIds
                WHERE p.ownerId = :ownerId
                  AND p.archived = :archived
            """)
    List<ProjectEntity> findAllWithMembers(@Param("ownerId") String ownerId, @Param("archived") Boolean archived);


    @Query("""
                SELECT DISTINCT p
                FROM ProjectEntity p
                LEFT JOIN FETCH p.memberIds
                WHERE p.id = :id
            """)
    Optional<ProjectEntity> findByIdWithMembers(@Param("id") UUID id);

    Optional<ProjectEntity> findByIdAndArchived(UUID id, Boolean archived);

    @Query("""
                SELECT p.id
                FROM ProjectEntity p
                WHERE p.archived = false
            """)
    List<UUID> findActiveProjectIds();
}
