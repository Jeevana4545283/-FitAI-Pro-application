package com.fitai.backend.service.impl;

import com.fitai.backend.dto.coach.CoachChatRequestDto;
import com.fitai.backend.dto.coach.CoachChatResponseDto;
import com.fitai.backend.service.CoachService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class CoachServiceImpl implements CoachService {

    @Override
    public CoachChatResponseDto processChat(CoachChatRequestDto requestDto) {
        String userMsg = requestDto.getMessage() != null ? requestDto.getMessage().trim() : "";
        String replyText = generateIntelligentResponse(userMsg);

        return CoachChatResponseDto.builder()
                .id("msg-" + UUID.randomUUID().toString().substring(0, 8))
                .sender("coach")
                .text(replyText)
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }

    /**
     * Intelligent rules engine generating context-aware response.
     * Easily replaceable with Spring AI / LangChain / Gemini API call in future iterations.
     */
    private String generateIntelligentResponse(String query) {
        String userPrompt = query;
        if (query.toLowerCase().contains("user message:")) {
            int idx = query.toLowerCase().indexOf("user message:");
            userPrompt = query.substring(idx + "user message:".length()).trim();
        }

        String q = userPrompt.toLowerCase();

        if (q.contains("sleep") || q.contains("recovery") || q.contains("hrv") || q.contains("rest")) {
            return "Your recovery score is currently at **92%** based on **7h 45m** of restorative sleep! Your Central Nervous System is fully recovered and ready for high-intensity training today.";
        }
        if (q.contains("protein") || q.contains("meal") || q.contains("nutrition") || q.contains("snack") || q.contains("eat")) {
            return "You've logged **1,600 kcal** and **110g protein** today. To hit your daily macro target, consider a 25g whey protein shake, Greek yogurt, or grilled chicken breast tonight.";
        }
        if (q.contains("pr") || q.contains("bench") || q.contains("goal") || q.contains("target")) {
            return "You are **81%** of the way to your **Bench 90kg** PR goal! Progressive overload parameters are set to increase volume by 8% next week.";
        }
        if (q.contains("perform") || q.contains("form") || q.contains("how to")) {
            return "For proper form: Retract your shoulder blades, plant your feet firmly into the floor, lower the bar/weight under full control to mid-chest, and press up explosively without flaring elbows out at 90 degrees!";
        }
        if (q.contains("alt") || q.contains("alternative") || q.contains("replace") || q.contains("swap")) {
            return "You can replace this exercise with **Incline Dumbbell Press**, **Cable Chest Flyes**, or **Weighted Push-Ups** to reduce joint stress while maintaining peak hypertrophy stimulus!";
        }
        if (q.contains("muscle") || q.contains("target") || q.contains("anatomy")) {
            return "This movement primarily targets the **Pectoralis Major** (Upper & Lower Chest), with secondary synergistic activation in your **Anterior Deltoids** (Front Shoulders) and **Triceps Brachii**.";
        }
        if (q.contains("weight") || q.contains("heavy") || q.contains("load")) {
            return "Use a weight where you can complete 8–10 reps with **2 Reps In Reserve (RIR 2)**. Once you comfortably hit all sets, increase the weight by 2.5 kg next session.";
        }
        if (q.contains("motivation") || q.contains("inspire") || q.contains("streak")) {
            return "You are on a **12-Day Workout Streak** 🔥! Every single clean set brings you closer to your fitness goals. Let's conquer today's session with peak intensity!";
        }
        if (q.contains("workout") || q.contains("exercise") || q.contains("training") || q.contains("push") || q.contains("plan")) {
            return "Today's top AI recommended program is **Push Strength & Hypertrophy** (45 mins · 4 exercises). Focus on progressive overload and strict tempo.";
        }

        return "FitAIX Coach here! Ask me about sleep recovery scores, high-protein meals, exercise form, alternative workouts, or your PR progression goals!";
    }
}
