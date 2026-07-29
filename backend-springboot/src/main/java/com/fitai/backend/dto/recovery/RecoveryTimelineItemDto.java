package com.fitai.backend.dto.recovery;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Recovery Timeline Item Data Transfer Object")
public class RecoveryTimelineItemDto {

    @Schema(description = "Timeline day label", example = "Today")
    private String day;

    @Schema(description = "Projected recovery score", example = "89")
    private Integer score;

    @Schema(description = "UI indicator color CSS variable or hex", example = "var(--green)")
    private String color;

    @Schema(description = "UI icon identifier", example = "check")
    private String icon;

    public RecoveryTimelineItemDto() {
    }

    public RecoveryTimelineItemDto(String day, Integer score, String color, String icon) {
        this.day = day;
        this.score = score;
        this.color = color;
        this.icon = icon;
    }

    public static RecoveryTimelineItemDtoBuilder builder() {
        return new RecoveryTimelineItemDtoBuilder();
    }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public static class RecoveryTimelineItemDtoBuilder {
        private String day;
        private Integer score;
        private String color;
        private String icon;

        public RecoveryTimelineItemDtoBuilder day(String day) { this.day = day; return this; }
        public RecoveryTimelineItemDtoBuilder score(Integer score) { this.score = score; return this; }
        public RecoveryTimelineItemDtoBuilder color(String color) { this.color = color; return this; }
        public RecoveryTimelineItemDtoBuilder icon(String icon) { this.icon = icon; return this; }

        public RecoveryTimelineItemDto build() {
            return new RecoveryTimelineItemDto(day, score, color, icon);
        }
    }
}
