package com.fitai.backend.dto.coach;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "AI Coach Chat Response Data Transfer Object")
public class CoachChatResponseDto {

    @Schema(description = "Unique message ID", example = "msg-1722000000")
    private String id;

    @Schema(description = "Sender identifier ('coach')", example = "coach")
    private String sender;

    @Schema(description = "AI Coach response text", example = "Your recovery is currently at 89% thanks to solid sleep.")
    private String text;

    @Schema(description = "Response ISO timestamp", example = "2026-07-27T18:06:23")
    private String timestamp;

    public CoachChatResponseDto() {
    }

    public CoachChatResponseDto(String id, String sender, String text, String timestamp) {
        this.id = id;
        this.sender = sender;
        this.text = text;
        this.timestamp = timestamp;
    }

    public static CoachChatResponseDtoBuilder builder() {
        return new CoachChatResponseDtoBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public static class CoachChatResponseDtoBuilder {
        private String id;
        private String sender;
        private String text;
        private String timestamp;

        public CoachChatResponseDtoBuilder id(String id) { this.id = id; return this; }
        public CoachChatResponseDtoBuilder sender(String sender) { this.sender = sender; return this; }
        public CoachChatResponseDtoBuilder text(String text) { this.text = text; return this; }
        public CoachChatResponseDtoBuilder timestamp(String timestamp) { this.timestamp = timestamp; return this; }

        public CoachChatResponseDto build() {
            return new CoachChatResponseDto(id, sender, text, timestamp);
        }
    }
}
