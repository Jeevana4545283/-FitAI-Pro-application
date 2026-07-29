package com.fitai.backend.controller;

import com.fitai.backend.dto.recovery.*;
import com.fitai.backend.service.RecoveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recovery")
@Tag(name = "Recovery & Health", description = "Endpoints for recovery scores, sleep metrics, body fatigue status, AI advice, and medical reports")
public class RecoveryController {

    private final RecoveryService recoveryService;

    @Autowired
    public RecoveryController(RecoveryService recoveryService) {
        this.recoveryService = recoveryService;
    }

    @Operation(summary = "Get Recovery Score & Health Overview", description = "Retrieves overall recovery score, sleep stats, resting heart rate, hydration %, and stress level.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recovery score retrieved successfully",
                    content = @Content(schema = @Schema(implementation = RecoveryScoreDto.class)))
    })
    @GetMapping
    public ResponseEntity<RecoveryScoreDto> getRecoveryScore() {
        RecoveryScoreDto score = recoveryService.getRecoveryScore();
        return ResponseEntity.ok(score);
    }

    @Operation(summary = "Get Recovery Timeline Projection", description = "Retrieves multi-day projected recovery scores.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recovery timeline retrieved successfully",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = RecoveryTimelineItemDto.class))))
    })
    @GetMapping("/timeline")
    public ResponseEntity<List<RecoveryTimelineItemDto>> getRecoveryTimeline() {
        List<RecoveryTimelineItemDto> timeline = recoveryService.getRecoveryTimeline();
        return ResponseEntity.ok(timeline);
    }

    @Operation(summary = "Get Body Fatigue Status Map", description = "Retrieves muscle recovery readiness status for chest, shoulders, back, arms, quads, and hamstrings.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Body status retrieved successfully",
                    content = @Content(schema = @Schema(implementation = BodyStatusDto.class)))
    })
    @GetMapping("/body-status")
    public ResponseEntity<BodyStatusDto> getBodyStatus() {
        BodyStatusDto bodyStatus = recoveryService.getBodyStatus();
        return ResponseEntity.ok(bodyStatus);
    }

    @Operation(summary = "Get AI Recovery Advice", description = "Retrieves recommended recovery routines (stretching, foam rolling, protein targets).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recovery advice list retrieved successfully",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = RecoveryAdviceDto.class))))
    })
    @GetMapping("/advice")
    public ResponseEntity<List<RecoveryAdviceDto>> getRecoveryAdvice() {
        List<RecoveryAdviceDto> adviceList = recoveryService.getRecoveryAdvice();
        return ResponseEntity.ok(adviceList);
    }

    @Operation(summary = "Get Medical Reports", description = "Lists user uploaded medical health reports.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Medical reports retrieved successfully",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = MedicalReportDto.class))))
    })
    @GetMapping("/reports")
    public ResponseEntity<List<MedicalReportDto>> getMedicalReports() {
        List<MedicalReportDto> reports = recoveryService.getMedicalReports();
        return ResponseEntity.ok(reports);
    }

    @Operation(summary = "Upload Medical Report", description = "Uploads a new medical report for AI analysis.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Medical report uploaded successfully",
                    content = @Content(schema = @Schema(implementation = MedicalReportDto.class)))
    })
    @PostMapping("/reports/upload")
    public ResponseEntity<MedicalReportDto> uploadMedicalReport(
            @Parameter(description = "Medical report file name", example = "Blood Report PDF")
            @RequestParam(name = "name", defaultValue = "Lab Report PDF") String name) {
        MedicalReportDto uploaded = recoveryService.uploadMedicalReport(name);
        return ResponseEntity.status(HttpStatus.CREATED).body(uploaded);
    }

    @Operation(summary = "Delete Medical Report", description = "Deletes a medical report by ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Medical report deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Medical report not found")
    })
    @DeleteMapping("/reports/{id}")
    public ResponseEntity<Void> deleteMedicalReport(
            @Parameter(description = "Medical Report ID to delete", example = "rep-1")
            @PathVariable("id") String id) {
        recoveryService.deleteMedicalReport(id);
        return ResponseEntity.noContent().build();
    }
}
