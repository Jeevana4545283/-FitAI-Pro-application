package com.fitai.backend.service;

import com.fitai.backend.dto.auth.AuthResponseDto;
import com.fitai.backend.dto.auth.LoginRequestDto;
import com.fitai.backend.dto.auth.RegisterRequestDto;

public interface AuthService {
    AuthResponseDto register(RegisterRequestDto request);
    AuthResponseDto login(LoginRequestDto request);
    void logout(String token);
}
