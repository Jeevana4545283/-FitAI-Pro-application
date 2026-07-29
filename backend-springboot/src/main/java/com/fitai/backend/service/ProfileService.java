package com.fitai.backend.service;

import com.fitai.backend.dto.profile.ProfileUpdateDto;
import com.fitai.backend.dto.profile.UserProfileDto;

public interface ProfileService {

    UserProfileDto getUserProfile();

    UserProfileDto updateProfile(ProfileUpdateDto profileUpdateDto);
}
