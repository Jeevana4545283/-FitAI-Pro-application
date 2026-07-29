package com.fitai.backend.dto.profile;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "User Profile Response Data Transfer Object")
public class UserProfileDto {

    @Schema(description = "User full name", example = "Priyanshi Sharma")
    private String name;

    @Schema(description = "User email address", example = "priyanshi@email.com")
    private String email;

    @Schema(description = "Height in centimeters", example = "168.0")
    private Double height;

    @Schema(description = "Weight in kilograms", example = "61.4")
    private Double weight;

    @Schema(description = "Age in years", example = "27")
    private Integer age;

    @Schema(description = "Gender identity", example = "Female")
    private String gender;

    @Schema(description = "Fitness experience level", example = "Intermediate")
    private String experience;

    @Schema(description = "Gym or Home workout location preference", example = "gym")
    private String gymHome;

    @Schema(description = "Available workout time in minutes", example = "45")
    private Integer availableTime;

    @Schema(description = "Selected fitness goals list", example = "[\"Lose Weight\", \"Improve Strength\"]")
    private List<String> goals;

    @Schema(description = "Available gym equipment list", example = "[\"Dumbbells\", \"Barbell\"]")
    private List<String> equipment;

    public UserProfileDto() {
    }

    public UserProfileDto(String name, String email, Double height, Double weight, Integer age, String gender, String experience, String gymHome, Integer availableTime, List<String> goals, List<String> equipment) {
        this.name = name;
        this.email = email;
        this.height = height;
        this.weight = weight;
        this.age = age;
        this.gender = gender;
        this.experience = experience;
        this.gymHome = gymHome;
        this.availableTime = availableTime;
        this.goals = goals;
        this.equipment = equipment;
    }

    public static UserProfileDtoBuilder builder() {
        return new UserProfileDtoBuilder();
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getGymHome() { return gymHome; }
    public void setGymHome(String gymHome) { this.gymHome = gymHome; }

    public Integer getAvailableTime() { return availableTime; }
    public void setAvailableTime(Integer availableTime) { this.availableTime = availableTime; }

    public List<String> getGoals() { return goals; }
    public void setGoals(List<String> goals) { this.goals = goals; }

    public List<String> getEquipment() { return equipment; }
    public void setEquipment(List<String> equipment) { this.equipment = equipment; }

    public static class UserProfileDtoBuilder {
        private String name;
        private String email;
        private Double height;
        private Double weight;
        private Integer age;
        private String gender;
        private String experience;
        private String gymHome;
        private Integer availableTime;
        private List<String> goals;
        private List<String> equipment;

        public UserProfileDtoBuilder name(String name) { this.name = name; return this; }
        public UserProfileDtoBuilder email(String email) { this.email = email; return this; }
        public UserProfileDtoBuilder height(Double height) { this.height = height; return this; }
        public UserProfileDtoBuilder weight(Double weight) { this.weight = weight; return this; }
        public UserProfileDtoBuilder age(Integer age) { this.age = age; return this; }
        public UserProfileDtoBuilder gender(String gender) { this.gender = gender; return this; }
        public UserProfileDtoBuilder experience(String experience) { this.experience = experience; return this; }
        public UserProfileDtoBuilder gymHome(String gymHome) { this.gymHome = gymHome; return this; }
        public UserProfileDtoBuilder availableTime(Integer availableTime) { this.availableTime = availableTime; return this; }
        public UserProfileDtoBuilder goals(List<String> goals) { this.goals = goals; return this; }
        public UserProfileDtoBuilder equipment(List<String> equipment) { this.equipment = equipment; return this; }

        public UserProfileDto build() {
            return new UserProfileDto(name, email, height, weight, age, gender, experience, gymHome, availableTime, goals, equipment);
        }
    }
}
