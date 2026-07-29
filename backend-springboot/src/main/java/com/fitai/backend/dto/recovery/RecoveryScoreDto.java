package com.fitai.backend.dto.recovery;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Recovery & Health Score Response Data Transfer Object")
public class RecoveryScoreDto {

    @Schema(description = "Overall recovery score percentage", example = "89")
    private Integer score;

    @Schema(description = "Recovery readiness status", example = "Ready to Train")
    private String status;

    @Schema(description = "Recovery guidance description", example = "Your body is recovered and primed for performance.")
    private String description;

    @Schema(description = "Last night sleep duration string", example = "7h 45m")
    private String sleep;

    @Schema(description = "Sleep quality status", example = "Good")
    private String sleepStatus;

    @Schema(description = "Weekly sleep quality history percentages")
    private List<Integer> sleepHistory;

    @Schema(description = "Resting heart rate in bpm", example = "62")
    private Integer heartRate;

    @Schema(description = "Heart rate status", example = "Resting")
    private String hrStatus;

    @Schema(description = "Current hydration in Liters", example = "2.4")
    private Double hydration;

    @Schema(description = "Hydration target percentage", example = "80")
    private Integer hydrationPct;

    @Schema(description = "Stress score out of 100", example = "42")
    private Integer stressScore;

    @Schema(description = "Stress level status", example = "Moderate")
    private String stressStatus;

    public RecoveryScoreDto() {
    }

    public RecoveryScoreDto(Integer score, String status, String description, String sleep, String sleepStatus, List<Integer> sleepHistory, Integer heartRate, String hrStatus, Double hydration, Integer hydrationPct, Integer stressScore, String stressStatus) {
        this.score = score;
        this.status = status;
        this.description = description;
        this.sleep = sleep;
        this.sleepStatus = sleepStatus;
        this.sleepHistory = sleepHistory;
        this.heartRate = heartRate;
        this.hrStatus = hrStatus;
        this.hydration = hydration;
        this.hydrationPct = hydrationPct;
        this.stressScore = stressScore;
        this.stressStatus = stressStatus;
    }

    public static RecoveryScoreDtoBuilder builder() {
        return new RecoveryScoreDtoBuilder();
    }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSleep() { return sleep; }
    public void setSleep(String sleep) { this.sleep = sleep; }

    public String getSleepStatus() { return sleepStatus; }
    public void setSleepStatus(String sleepStatus) { this.sleepStatus = sleepStatus; }

    public List<Integer> getSleepHistory() { return sleepHistory; }
    public void setSleepHistory(List<Integer> sleepHistory) { this.sleepHistory = sleepHistory; }

    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }

    public String getHrStatus() { return hrStatus; }
    public void setHrStatus(String hrStatus) { this.hrStatus = hrStatus; }

    public Double getHydration() { return hydration; }
    public void setHydration(Double hydration) { this.hydration = hydration; }

    public Integer getHydrationPct() { return hydrationPct; }
    public void setHydrationPct(Integer hydrationPct) { this.hydrationPct = hydrationPct; }

    public Integer getStressScore() { return stressScore; }
    public void setStressScore(Integer stressScore) { this.stressScore = stressScore; }

    public String getStressStatus() { return stressStatus; }
    public void setStressStatus(String stressStatus) { this.stressStatus = stressStatus; }

    public static class RecoveryScoreDtoBuilder {
        private Integer score;
        private String status;
        private String description;
        private String sleep;
        private String sleepStatus;
        private List<Integer> sleepHistory;
        private Integer heartRate;
        private String hrStatus;
        private Double hydration;
        private Integer hydrationPct;
        private Integer stressScore;
        private String stressStatus;

        public RecoveryScoreDtoBuilder score(Integer score) { this.score = score; return this; }
        public RecoveryScoreDtoBuilder status(String status) { this.status = status; return this; }
        public RecoveryScoreDtoBuilder description(String description) { this.description = description; return this; }
        public RecoveryScoreDtoBuilder sleep(String sleep) { this.sleep = sleep; return this; }
        public RecoveryScoreDtoBuilder sleepStatus(String sleepStatus) { this.sleepStatus = sleepStatus; return this; }
        public RecoveryScoreDtoBuilder sleepHistory(List<Integer> sleepHistory) { this.sleepHistory = sleepHistory; return this; }
        public RecoveryScoreDtoBuilder heartRate(Integer heartRate) { this.heartRate = heartRate; return this; }
        public RecoveryScoreDtoBuilder hrStatus(String hrStatus) { this.hrStatus = hrStatus; return this; }
        public RecoveryScoreDtoBuilder hydration(Double hydration) { this.hydration = hydration; return this; }
        public RecoveryScoreDtoBuilder hydrationPct(Integer hydrationPct) { this.hydrationPct = hydrationPct; return this; }
        public RecoveryScoreDtoBuilder stressScore(Integer stressScore) { this.stressScore = stressScore; return this; }
        public RecoveryScoreDtoBuilder stressStatus(String stressStatus) { this.stressStatus = stressStatus; return this; }

        public RecoveryScoreDto build() {
            return new RecoveryScoreDto(score, status, description, sleep, sleepStatus, sleepHistory, heartRate, hrStatus, hydration, hydrationPct, stressScore, stressStatus);
        }
    }
}
