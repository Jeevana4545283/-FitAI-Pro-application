package com.fitai.backend.service.impl;

import com.fitai.backend.dto.leaderboard.LeaderboardUserDto;
import com.fitai.backend.service.LeaderboardService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaderboardServiceImpl implements LeaderboardService {

    @Override
    public List<LeaderboardUserDto> getLeaderboard() {
        return List.of(
                LeaderboardUserDto.builder().rank(1).name("Arjun").workouts(32).score(2840).avatar("A").me(false).build(),
                LeaderboardUserDto.builder().rank(2).name("You").workouts(28).score(2610).avatar("P").me(true).build(),
                LeaderboardUserDto.builder().rank(3).name("Sara").workouts(25).score(2340).avatar("S").me(false).build()
        );
    }
}
