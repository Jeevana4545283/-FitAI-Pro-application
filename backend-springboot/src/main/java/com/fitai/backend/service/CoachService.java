package com.fitai.backend.service;

import com.fitai.backend.dto.coach.CoachChatRequestDto;
import com.fitai.backend.dto.coach.CoachChatResponseDto;

public interface CoachService {

    CoachChatResponseDto processChat(CoachChatRequestDto requestDto);
}
