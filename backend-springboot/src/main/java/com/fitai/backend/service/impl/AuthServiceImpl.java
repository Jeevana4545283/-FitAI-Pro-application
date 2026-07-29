package com.fitai.backend.service.impl;

import com.fitai.backend.dto.auth.AuthResponseDto;
import com.fitai.backend.dto.auth.LoginRequestDto;
import com.fitai.backend.dto.auth.RegisterRequestDto;
import com.fitai.backend.service.AuthService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Override
    public AuthResponseDto register(RegisterRequestDto request) {
        String userId = "usr-" + UUID.randomUUID().toString().substring(0, 8);
        String mockJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ii" + Base64UrlEncode(request.getName()) +
                "IiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        return AuthResponseDto.builder()
                .token(mockJwt)
                .tokenType("Bearer")
                .id(userId)
                .name(request.getName())
                .email(request.getEmail())
                .message("User registered successfully")
                .build();
    }

    @Override
    public AuthResponseDto login(LoginRequestDto request) {
        String userId = "usr-1";
        String userName = request.getEmail().contains("@")
                ? request.getEmail().substring(0, request.getEmail().indexOf("@"))
                : "Athlete";
        userName = userName.substring(0, 1).toUpperCase() + userName.substring(1);

        String mockJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                "eyJzdWIiOiJ1c3ItMSIsIm5hbWUiOiJ" + Base64UrlEncode(userName) +
                "IiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        return AuthResponseDto.builder()
                .token(mockJwt)
                .tokenType("Bearer")
                .id(userId)
                .name(userName)
                .email(request.getEmail())
                .message("Login successful")
                .build();
    }

    @Override
    public void logout(String token) {
        // In-memory or Redis token blacklist logic can be placed here in future
    }

    private String Base64UrlEncode(String input) {
        if (input == null) return "";
        return java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(input.getBytes());
    }
}
