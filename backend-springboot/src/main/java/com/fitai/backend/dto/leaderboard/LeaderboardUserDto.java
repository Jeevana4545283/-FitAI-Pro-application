package com.fitai.backend.dto.leaderboard;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Leaderboard User Ranking Data Transfer Object")
public class LeaderboardUserDto {

    @Schema(description = "Rank position", example = "1")
    private Integer rank;

    @Schema(description = "User display name", example = "Arjun")
    private String name;

    @Schema(description = "Completed workouts count", example = "32")
    private Integer workouts;

    @Schema(description = "Total score points", example = "2840")
    private Integer score;

    @Schema(description = "Avatar initial letter", example = "A")
    private String avatar;

    @Schema(description = "Is current logged-in user indicator", example = "false")
    private Boolean me;

    public LeaderboardUserDto() {
    }

    public LeaderboardUserDto(Integer rank, String name, Integer workouts, Integer score, String avatar, Boolean me) {
        this.rank = rank;
        this.name = name;
        this.workouts = workouts;
        this.score = score;
        this.avatar = avatar;
        this.me = me;
    }

    public static LeaderboardUserDtoBuilder builder() {
        return new LeaderboardUserDtoBuilder();
    }

    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getWorkouts() { return workouts; }
    public void setWorkouts(Integer workouts) { this.workouts = workouts; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Boolean getMe() { return me; }
    public void setMe(Boolean me) { this.me = me; }

    public static class LeaderboardUserDtoBuilder {
        private Integer rank;
        private String name;
        private Integer workouts;
        private Integer score;
        private String avatar;
        private Boolean me;

        public LeaderboardUserDtoBuilder rank(Integer rank) { this.rank = rank; return this; }
        public LeaderboardUserDtoBuilder name(String name) { this.name = name; return this; }
        public LeaderboardUserDtoBuilder workouts(Integer workouts) { this.workouts = workouts; return this; }
        public LeaderboardUserDtoBuilder score(Integer score) { this.score = score; return this; }
        public LeaderboardUserDtoBuilder avatar(String avatar) { this.avatar = avatar; return this; }
        public LeaderboardUserDtoBuilder me(Boolean me) { this.me = me; return this; }

        public LeaderboardUserDto build() {
            return new LeaderboardUserDto(rank, name, workouts, score, avatar, me);
        }
    }
}
