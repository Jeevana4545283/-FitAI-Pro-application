package com.fitai.backend.service.impl;

import com.fitai.backend.dto.profile.ProfileUpdateDto;
import com.fitai.backend.dto.profile.UserProfileDto;
import com.fitai.backend.service.ProfileService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProfileServiceImpl implements ProfileService {

    // Mock in-memory state ready for future JPA repository replacement
    private UserProfileDto currentProfile = UserProfileDto.builder()
            .name("Priyanshi Sharma")
            .email("priyanshi@email.com")
            .height(168.0)
            .weight(61.4)
            .age(27)
            .gender("Female")
            .experience("Intermediate")
            .gymHome("gym")
            .availableTime(45)
            .goals(new ArrayList<>(List.of("Lose Weight", "Improve Strength")))
            .equipment(new ArrayList<>(List.of("Dumbbells", "Barbell")))
            .build();

    @Override
    public UserProfileDto getUserProfile() {
        return currentProfile;
    }

    @Override
    public UserProfileDto updateProfile(ProfileUpdateDto dto) {
        if (dto.getName() != null) {
            currentProfile.setName(dto.getName());
        }
        if (dto.getEmail() != null) {
            currentProfile.setEmail(dto.getEmail());
        }
        if (dto.getHeight() != null) {
            currentProfile.setHeight(dto.getHeight());
        }
        if (dto.getWeight() != null) {
            currentProfile.setWeight(dto.getWeight());
        }
        if (dto.getAge() != null) {
            currentProfile.setAge(dto.getAge());
        }
        if (dto.getGender() != null) {
            currentProfile.setGender(dto.getGender());
        }
        if (dto.getExperience() != null) {
            currentProfile.setExperience(dto.getExperience());
        }
        if (dto.getGymHome() != null) {
            currentProfile.setGymHome(dto.getGymHome());
        }
        if (dto.getAvailableTime() != null) {
            currentProfile.setAvailableTime(dto.getAvailableTime());
        }
        if (dto.getGoals() != null) {
            currentProfile.setGoals(new ArrayList<>(dto.getGoals()));
        }
        if (dto.getEquipment() != null) {
            currentProfile.setEquipment(new ArrayList<>(dto.getEquipment()));
        }

        return currentProfile;
    }
}
