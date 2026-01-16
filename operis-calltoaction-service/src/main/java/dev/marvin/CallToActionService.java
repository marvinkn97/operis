package dev.marvin;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CallToActionService {
    private final CallToActionRepository callToActionRepository;

    public void actionForProjectInvitation(CallToActionRequest callToActionRequest, Authentication authentication) {


        //TODO: Check whether to tie to email or id?

        CallToActionEntity callToActionEntity = CallToActionEntity.builder()
                .type(CallToActionType.PROJECT_INVITATION)
                .status(CallToActionStatus.PENDING)
                .target(CallToActionTarget.USER)
                .targetId(authentication.getName())
                .targetEmail(callToActionRequest.targetEmail())
                .build();
    }
}
