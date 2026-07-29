package com.fitai.backend.dto.recovery;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "AI Recovery Advice Data Transfer Object")
public class RecoveryAdviceDto {

    @Schema(description = "Advice ID", example = "1")
    private String id;

    @Schema(description = "Advice title", example = "Light Stretching")
    private String title;

    @Schema(description = "Recommended duration or target", example = "10 min")
    private String duration;

    public RecoveryAdviceDto() {
    }

    public RecoveryAdviceDto(String id, String title, String duration) {
        this.id = id;
        this.title = title;
        this.duration = duration;
    }

    public static RecoveryAdviceDtoBuilder builder() {
        return new RecoveryAdviceDtoBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public static class RecoveryAdviceDtoBuilder {
        private String id;
        private String title;
        private String duration;

        public RecoveryAdviceDtoBuilder id(String id) { this.id = id; return this; }
        public RecoveryAdviceDtoBuilder title(String title) { this.title = title; return this; }
        public RecoveryAdviceDtoBuilder duration(String duration) { this.duration = duration; return this; }

        public RecoveryAdviceDto build() {
            return new RecoveryAdviceDto(id, title, duration);
        }
    }
}
