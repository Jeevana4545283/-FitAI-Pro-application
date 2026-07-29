package com.fitai.backend.dto.profile;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.util.List;

@Schema(description = "Profile Update Request Data Transfer Object")
public class ProfileUpdateDto {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Schema(description = "Updated user full name", example = "Priyanshi Sharma")
    private String name;

    @Email(message = "Email must be a valid email format")
    @Schema(description = "Updated user email address", example = "priyanshi@email.com")
    private String email;

    @Min(value = 50, message = "Height must be at least 50 cm")
    @Max(value = 250, message = "Height must be at most 250 cm")
    @Schema(description = "Updated height in cm", example = "168.0")
    private Double height;

    @Min(value = 20, message = "Weight must be at least 20 kg")
    @Max(value = 300, message = "Weight must be at most 300 kg")
    @Schema(description = "Updated weight in kg", example = "61.4")
    private Double weight;

    @Min(value = 10, message = "Age must be at least 10 years")
    @Max(value = 120, message = "Age must be at most 120 years")
    @Schema(description = "Updated age in years", example = "27")
    private Integer age;

    @Schema(description = "Updated gender identity", example = "Female")
    private String gender;

    @Schema(description = "Updated experience level", example = "Intermediate")
    private String experience;

    @Schema(description = "Updated workout environment ('gym' or 'home')", example = "gym")
    private String gymHome;

    @Min(value = 5, message = "Available time must be at least 5 minutes")
    @Max(value = 300, message = "Available time cannot exceed 300 minutes")
    @Schema(description = "Updated available time in minutes", example = "45")
    private Integer availableTime;

    @Schema(description = "Updated fitness goals list")
    private List<String> goals;

    @Schema(description = "Updated available equipment list")
    private List<String> equipment;

    public ProfileUpdateDto() {
    }

    public ProfileUpdateDto(String name, String email, Double height, Double weight, Integer age, String gender, String experience, String gymHome, Integer availableTime, List<String> goals, List<String> equipment) {
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

    public static ProfileUpdateDtoBuilder builder() {
        return new ProfileUpdateDtoBuilder();
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

    public static class ProfileUpdateDtoBuilder {
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

        public ProfileUpdateDtoBuilder name(String name) { this.name = name; return this; }
        public ProfileUpdateDtoBuilder email(String email) { this.email = email; return this; }
        public ProfileUpdateDtoBuilder height(Double height) { this.height = height; return this; }
        public ProfileUpdateDtoBuilder weight(Double weight) { this.weight = weight; return this; }
        public ProfileUpdateDtoBuilder age(Integer age) { this.age = age; return this; }
        public ProfileUpdateDtoBuilder gender(String gender) { this.gender = gender; return this; }
        public ProfileUpdateDtoBuilder experience(String experience) { this.experience = experience; return this; }
        public ProfileUpdateDtoBuilder gymHome(String gymHome) { this.gymHome = gymHome; return this; }
        public ProfileUpdateDtoBuilder availableTime(Integer availableTime) { this.availableTime = availableTime; return this; }
        public ProfileUpdateDtoBuilder goals(List<String> goals) { this.goals = goals; return this; }
        public ProfileUpdateDtoBuilder equipment(List<String> equipment) { this.equipment = equipment; return this; }

        public ProfileUpdateDto build() {
            return new ProfileUpdateDto(name, email, height, weight, age, gender, experience, gymHome, availableTime, goals, equipment);
        }
    }
}
