package com.fitai.backend.controller;

import com.fitai.backend.dto.profile.ProfileUpdateDto;
import com.fitai.backend.dto.profile.UserProfileDto;
import com.fitai.backend.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@Tag(name = "User Profile", description = "Endpoints for managing user health profile, body metrics, and fitness preferences")
public class ProfileController {

    private final ProfileService profileService;

    @Autowired
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @Operation(summary = "Get User Profile", description = "Retrieves the current user's profile details including height, weight, goals, and equipment preferences.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile retrieved successfully",
                    content = @Content(schema = @Schema(implementation = UserProfileDto.class)))
    })
    @GetMapping
    public ResponseEntity<UserProfileDto> getProfile() {
        UserProfileDto profile = profileService.getUserProfile();
        return ResponseEntity.ok(profile);
    }

    @Operation(summary = "Update User Profile", description = "Updates user profile metrics, goals, or equipment availability.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile updated successfully",
                    content = @Content(schema = @Schema(implementation = UserProfileDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid profile payload validation",
                    content = @Content)
    })
    @PutMapping
    public ResponseEntity<UserProfileDto> updateProfile(@Valid @RequestBody ProfileUpdateDto profileUpdateDto) {
        UserProfileDto updatedProfile = profileService.updateProfile(profileUpdateDto);
        return ResponseEntity.ok(updatedProfile);
    }
}
