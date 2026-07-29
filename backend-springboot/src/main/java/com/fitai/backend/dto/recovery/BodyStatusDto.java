package com.fitai.backend.dto.recovery;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Muscle Recovery Body Status Data Transfer Object")
public class BodyStatusDto {

    @Schema(description = "Chest recovery status color", example = "var(--green)")
    private String chest;

    @Schema(description = "Shoulders recovery status color", example = "var(--green)")
    private String shoulders;

    @Schema(description = "Back recovery status color", example = "var(--green)")
    private String back;

    @Schema(description = "Arms recovery status color", example = "var(--amber)")
    private String arms;

    @Schema(description = "Quads recovery status color", example = "var(--red)")
    private String quads;

    @Schema(description = "Hamstrings recovery status color", example = "var(--amber)")
    private String hamstrings;

    public BodyStatusDto() {
    }

    public BodyStatusDto(String chest, String shoulders, String back, String arms, String quads, String hamstrings) {
        this.chest = chest;
        this.shoulders = shoulders;
        this.back = back;
        this.arms = arms;
        this.quads = quads;
        this.hamstrings = hamstrings;
    }

    public static BodyStatusDtoBuilder builder() {
        return new BodyStatusDtoBuilder();
    }

    public String getChest() { return chest; }
    public void setChest(String chest) { this.chest = chest; }

    public String getShoulders() { return shoulders; }
    public void setShoulders(String shoulders) { this.shoulders = shoulders; }

    public String getBack() { return back; }
    public void setBack(String back) { this.back = back; }

    public String getArms() { return arms; }
    public void setArms(String arms) { this.arms = arms; }

    public String getQuads() { return quads; }
    public void setQuads(String quads) { this.quads = quads; }

    public String getHamstrings() { return hamstrings; }
    public void setHamstrings(String hamstrings) { this.hamstrings = hamstrings; }

    public static class BodyStatusDtoBuilder {
        private String chest;
        private String shoulders;
        private String back;
        private String arms;
        private String quads;
        private String hamstrings;

        public BodyStatusDtoBuilder chest(String chest) { this.chest = chest; return this; }
        public BodyStatusDtoBuilder shoulders(String shoulders) { this.shoulders = shoulders; return this; }
        public BodyStatusDtoBuilder back(String back) { this.back = back; return this; }
        public BodyStatusDtoBuilder arms(String arms) { this.arms = arms; return this; }
        public BodyStatusDtoBuilder quads(String quads) { this.quads = quads; return this; }
        public BodyStatusDtoBuilder hamstrings(String hamstrings) { this.hamstrings = hamstrings; return this; }

        public BodyStatusDto build() {
            return new BodyStatusDto(chest, shoulders, back, arms, quads, hamstrings);
        }
    }
}
