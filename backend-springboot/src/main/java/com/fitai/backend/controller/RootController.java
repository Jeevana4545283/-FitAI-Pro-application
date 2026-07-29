package com.fitai.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping
@Tag(name = "API Root & Health", description = "Root health status endpoint")
public class RootController {

    @Operation(summary = "API Root & Health Status", description = "Returns health status and documentation links for the FitAI backend service.")
    @GetMapping({"", "/", "/health"})
    public ResponseEntity<Map<String, Object>> getApiRoot() {
        Map<String, Object> response = Map.of(
                "status", "UP",
                "service", "FitAI Pro REST API Backend",
                "version", "1.0.0",
                "documentation", "http://localhost:8000/api/v1/swagger-ui.html",
                "timestamp", LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }
}
