package com.fitai.backend.controller;

import com.fitai.backend.dto.coach.CoachChatRequestDto;
import com.fitai.backend.dto.coach.CoachChatResponseDto;
import com.fitai.backend.service.CoachService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/coach")
@Tag(name = "AI Coach Assistant", description = "Endpoints for interacting with the stats-aware FitAI Assistant")
public class CoachController {

    private final CoachService coachService;

    @Autowired
    public CoachController(CoachService coachService) {
        this.coachService = coachService;
    }

    @Operation(summary = "Chat with AI Coach", description = "Processes user prompts and returns stats-aware intelligent fitness, recovery, and nutrition coaching advice.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "AI Coach response generated successfully",
                    content = @Content(schema = @Schema(implementation = CoachChatResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request message payload")
    })
    @PostMapping("/chat")
    public ResponseEntity<CoachChatResponseDto> chat(@Valid @RequestBody CoachChatRequestDto requestDto) {
        CoachChatResponseDto response = coachService.processChat(requestDto);
        return ResponseEntity.ok(response);
    }
}
