package dev.marvin;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CallToActionRepository extends MongoRepository<CallToActionEntity, String> {
}
