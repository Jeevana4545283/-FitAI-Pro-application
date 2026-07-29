package com.fitai.backend.service;

import com.fitai.backend.dto.leaderboard.LeaderboardUserDto;
import java.util.List;

public interface LeaderboardService {

    List<LeaderboardUserDto> getLeaderboard();
}
