package com.fitai.backend.dto.coach;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "AI Coach Chat Request Data Transfer Object")
public class CoachChatRequestDto {

    @NotBlank(message = "Chat message text is required")
    @Schema(description = "User prompt or question for AI Coach", example = "How is my recovery status today?")
    private String message;

    public CoachChatRequestDto() {
    }

    public CoachChatRequestDto(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
