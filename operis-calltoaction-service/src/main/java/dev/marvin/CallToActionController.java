package dev.marvin;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/call-to-actions")
@RequiredArgsConstructor
@Slf4j
@Tag(name="Call To Action API", description = "Operations for managing call to actions")
public class CallToActionController {
    private final CallToActionService callToActionService;

}
