package dev.marvin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/call-to-actions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Call To Action API", description = "Operations for managing call to actions")
public class CallToActionController {
    private final CallToActionService callToActionService;
    private final PagedResourcesAssembler<CallToActionResponse> assembler;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get all ctas")
    public ResponseEntity<PagedModel<EntityModel<CallToActionResponse>>> getCTAs(
            @RequestParam(name = "pageNumber", required = false, defaultValue = "0") int pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") int pageSize,
            @NonNull JwtAuthenticationToken jwtAuthenticationToken
    ) {
        log.info("GET_CTAs_REQUEST page={} size={}", pageNumber, pageSize);
        Page<CallToActionResponse> page = callToActionService.getCTAs(
                PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt")),
                jwtAuthenticationToken
        );
        return ResponseEntity.ok(assembler.toModel(page));
    }

}
