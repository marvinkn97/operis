package dev.marvin;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.UUID;

@Data
@Builder
@Document(collection = "call_to_actions")
public class CallToActionEntity {
    @MongoId
    private UUID id;
    private CallToActionType type;
    private CallToActionStatus status;
    private CallToActionTarget target;
    private String userId;
    /**
     * JSON metadata for generic UI behavior
     */
    private String metadata;


}
