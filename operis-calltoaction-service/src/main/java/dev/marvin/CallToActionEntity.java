package dev.marvin;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@Document(collection = "call_to_actions")
public class CallToActionEntity {
    @MongoId
    private UUID id;
    private CallToActionType type;
    @Builder.Default
    private CallToActionStatus status = CallToActionStatus.PENDING;
    private CallToActionTarget target;
    private String targetId;
    private String targetEmail;
    private Map<String, Object> metadata; //JSON metadata for generic UI behavior
    private Instant createdAt;
}
