package com.fitai.backend.controller;

import com.fitai.backend.dto.analytics.AnalyticsSummaryDto;
import com.fitai.backend.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
@Tag(name = "Analytics & Progress", description = "Endpoints for fitness score, radar metrics, calories burned charts, and achievements")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Autowired
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @Operation(summary = "Get Analytics Summary", description = "Retrieves overall fitness score (/100), workout compliance, strength radar metrics, and AI insights.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Analytics summary retrieved successfully",
                    content = @Content(schema = @Schema(implementation = AnalyticsSummaryDto.class)))
    })
    @GetMapping
    public ResponseEntity<AnalyticsSummaryDto> getAnalyticsSummary(
            @Parameter(description = "Time range filter: '7D', '30D', '90D', '1Y'", example = "30D")
            @RequestParam(name = "range", defaultValue = "30D") String range) {
        AnalyticsSummaryDto analytics = analyticsService.getAnalyticsSummary(range);
        return ResponseEntity.ok(analytics);
    }
}
