"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Base API configuration
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 3000
});

// Types
export interface UserProfile {
  name: string;
  email: string;
  height: number; // cm
  weight: number; // kg
  age: number;
  gender: string;
  experience: string;
  gymHome: "gym" | "home";
  availableTime: number; // minutes
}

export interface ExerciseSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: number; // seconds
  kcal: number;
  muscle: string;
  completedSets?: boolean[];
}

export interface Workout {
  name: string;
  duration: number; // minutes
  kcal: number;
  exercises: WorkoutExercise[];
  whySelected?: string;
  difficulty: string;
}

export interface ActivityLog {
  id: string;
  type: "workout" | "nutrition" | "milestone" | "water";
  title: string;
  desc: string;
  time: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  workouts: number;
  score: number;
  avatar: string;
  me: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  category: "recovery" | "social" | "water" | "workout";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

interface AppState {
  profile: UserProfile;
  goals: string[];
  equipment: string[];
  recoveryScore: number;
  sleepHours: number;
  sleepMinutes: number;
  workoutStreak: number;
  streakDays: { day: string; done: boolean }[];
  caloriesToday: number;
  proteinToday: number;
  carbsToday: number;
  fatsToday: number;
  waterToday: number; // in liters
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];
  leaderboard: LeaderboardUser[];
  activeWorkout: Workout | null;
  workoutActive: boolean;
  workoutCompleted: boolean;
  workoutStartTime: number | null;
  aiWorkoutPlans: Workout[];
  chatHistory: ChatMessage[];
  xp: number;
  level: number;
  coins: number;
}

interface AppStateContextType extends AppState {
  updateProfile: (profile: Partial<UserProfile>) => void;
  toggleGoal: (goal: string) => void;
  toggleEquipment: (equip: string) => void;
  addWater: () => void;
  removeWater: () => void;
  logMeal: (calories: number, protein: number, carbs: number, fats: number) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  completeSet: (exerciseIndex: number, setIndex: number) => void;
  startWorkout: () => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  generateAIWorkout: (params: { goal: string; time: number; equip: string[]; difficulty: string }) => void;
  addChatMessage: (text: string) => void;
  claimDailyReward: () => void;
  resetAppState: () => void;
}

const DEFAULT_STATE: AppState = {
  profile: {
    name: "Athlete",
    email: "athlete@fitaix.com",
    height: 168,
    weight: 61.4,
    age: 27,
    gender: "Female",
    experience: "Intermediate",
    gymHome: "gym",
    availableTime: 45,
  },
  goals: ["Lose Weight", "Improve Strength"],
  equipment: ["Dumbbells", "Barbell"],
  recoveryScore: 89,
  sleepHours: 7,
  sleepMinutes: 45,
  workoutStreak: 24,
  streakDays: [
    { day: "M", done: true },
    { day: "T", done: true },
    { day: "W", done: true },
    { day: "T", done: true },
    { day: "F", done: false },
    { day: "S", done: false },
    { day: "S", done: false },
  ],
  caloriesToday: 1600,
  proteinToday: 110,
  carbsToday: 180,
  fatsToday: 55,
  waterToday: 1.8,
  notifications: [
    { id: "1", title: "Your recovery improved 6%", desc: "Great sleep last night helped a lot", time: "2h", unread: true, category: "recovery" },
    { id: "2", title: "Arjun passed your weekly weekly score", desc: "Push a bit harder to reclaim #1", time: "5h", unread: true, category: "social" },
    { id: "3", title: "Hydration goal hit 3 days straight", desc: "Keep the streak going today", time: "1d", unread: false, category: "water" },
  ],
  activityLogs: [
    { id: "a1", type: "workout", title: "Completed Pull Day", desc: "6 exercises · 380 kcal", time: "Yesterday" },
    { id: "a2", type: "nutrition", title: "Hit Protein Goal", desc: "142g logged", time: "Yesterday" },
    { id: "a3", type: "milestone", title: "New PR: Bench 90kg", desc: "+5kg from last month", time: "2 days ago" },
  ],
  leaderboard: [
    { rank: 1, name: "Arjun", workouts: 32, score: 2840, avatar: "A", me: false },
    { rank: 2, name: "You", workouts: 28, score: 2610, avatar: "P", me: true },
    { rank: 3, name: "Sara", workouts: 25, score: 2340, avatar: "S", me: false },
  ],
  activeWorkout: {
    name: "Push Strength",
    duration: 45,
    kcal: 420,
    difficulty: "Intermediate",
    whySelected: "Chest fully recovered. Increase pushing volume by 8% for better results.",
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: "8–10", rest: 60, kcal: 120, muscle: "Chest", completedSets: [false, false, false, false] },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10–12", rest: 60, kcal: 90, muscle: "Chest · Shoulders", completedSets: [false, false, false] },
      { name: "Cable Fly", sets: 3, reps: "12–15", rest: 45, kcal: 75, muscle: "Chest", completedSets: [false, false, false] },
      { name: "Rope Tricep Pushdown", sets: 3, reps: "12–15", rest: 45, kcal: 60, muscle: "Triceps", completedSets: [false, false, false] }
    ],
  },
  workoutActive: false,
  workoutCompleted: false,
  workoutStartTime: null,
  aiWorkoutPlans: [],
  chatHistory: [
    { id: "c1", sender: "coach", text: "Hello! I am your AI Coach. Ask me anything about your recovery metrics, workout form, or macro targets.", timestamp: "10:00 AM" }
  ],
  xp: 450,
  level: 2,
  coins: 120,
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Initial State Load from LocalStorage & REST API
  useEffect(() => {
    const initializeState = async () => {
      let localStateData: AppState | null = null;
      try {
        const saved = localStorage.getItem("fitaix_app_state");
        if (saved) {
          localStateData = JSON.parse(saved);
        }
      } catch (e) {
        console.error("Error reading localStorage", e);
      }

      const mergedState = localStateData ? { ...DEFAULT_STATE, ...localStateData } : DEFAULT_STATE;
      setState(mergedState);
      setIsLoaded(true);

      // Attempt live sync from REST API
      try {
        const [profileRes, nutritionRes, leaderboardRes] = await Promise.all([
          api.get("/profile"),
          api.get("/nutrition"),
          api.get("/leaderboard")
        ]);

        setState((prev) => ({
          ...prev,
          profile: { ...prev.profile, ...profileRes.data },
          caloriesToday: nutritionRes.data.caloriesToday,
          proteinToday: nutritionRes.data.proteinToday,
          carbsToday: nutritionRes.data.carbsToday,
          fatsToday: nutritionRes.data.fatsToday,
          waterToday: nutritionRes.data.waterToday,
          leaderboard: leaderboardRes.data
        }));
      } catch (err) {
        console.warn("REST API connection failed, operating in offline fallback mode:", err);
      }
    };

    initializeState();
  }, []);

  // 2. Persist State Changes to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("fitaix_app_state", JSON.stringify(state));
      } catch (e) {
        console.error("Error saving state to localStorage", e);
      }
    }
  }, [state, isLoaded]);

  // Actions
  const updateProfile = async (profileUpdate: Partial<UserProfile>) => {
    // Optimistic Update
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdate },
    }));

    try {
      await api.put("/profile", profileUpdate);
    } catch (err) {
      console.warn("Failed to sync profile update to backend:", err);
    }
  };

  const toggleGoal = (goal: string) => {
    setState((prev) => {
      const goals = prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal];
      return { ...prev, goals };
    });
  };

  const toggleEquipment = (equip: string) => {
    setState((prev) => {
      const equipment = prev.equipment.includes(equip)
        ? prev.equipment.filter((e) => e !== equip)
        : [...prev.equipment, equip];
      return { ...prev, equipment };
    });
  };

  const addWater = async () => {
    // Optimistic Update
    setState((prev) => {
      const newWater = parseFloat((prev.waterToday + 0.4).toFixed(1));
      const logAdded = newWater === 2.8;
      let notifications = prev.notifications;
      if (logAdded) {
        notifications = [
          {
            id: Date.now().toString(),
            title: "Hydration Goal Achieved! 💧",
            desc: "You hit your 2.8L hydration goal. Excellent work!",
            time: "Now",
            unread: true,
            category: "water",
          },
          ...prev.notifications,
        ];
      }
      return {
        ...prev,
        waterToday: newWater,
        notifications,
        xp: prev.xp + 10,
        coins: prev.coins + 2,
      };
    });

    try {
      const res = await api.post("/nutrition/water?action=add");
      setState((prev) => ({
        ...prev,
        waterToday: res.data.waterToday
      }));
    } catch (err) {
      console.warn("Failed to sync water addition to backend:", err);
    }
  };

  const removeWater = async () => {
    setState((prev) => ({
      ...prev,
      waterToday: Math.max(0, parseFloat((prev.waterToday - 0.4).toFixed(1))),
    }));

    try {
      const res = await api.post("/nutrition/water?action=remove");
      setState((prev) => ({
        ...prev,
        waterToday: res.data.waterToday
      }));
    } catch (err) {
      console.warn("Failed to sync water removal to backend:", err);
    }
  };

  const logMeal = async (calories: number, protein: number, carbs: number, fats: number) => {
    setState((prev) => {
      const newLog: ActivityLog = {
        id: Date.now().toString(),
        type: "nutrition",
        title: `Logged Meal (${calories} kcal)`,
        desc: `P: ${protein}g · C: ${carbs}g · F: ${fats}g`,
        time: "Now",
      };

      return {
        ...prev,
        caloriesToday: prev.caloriesToday + calories,
        proteinToday: prev.proteinToday + protein,
        carbsToday: prev.carbsToday + carbs,
        fatsToday: prev.fatsToday + fats,
        activityLogs: [newLog, ...prev.activityLogs],
        xp: prev.xp + 15,
        coins: prev.coins + 5,
      };
    });

    try {
      const res = await api.post("/nutrition/meal", { calories, protein, carbs, fats });
      setState((prev) => ({
        ...prev,
        caloriesToday: res.data.caloriesToday,
        proteinToday: res.data.proteinToday,
        carbsToday: res.data.carbsToday,
        fatsToday: res.data.fatsToday,
      }));
    } catch (err) {
      console.warn("Failed to sync meal to backend:", err);
    }
  };

  const dismissNotification = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      ),
    }));
  };

  const clearAllNotifications = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
    }));
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    setState((prev) => {
      if (!prev.activeWorkout) return prev;
      
      const updatedExercises = [...prev.activeWorkout.exercises];
      const exercise = { ...updatedExercises[exerciseIndex] };
      const completedSets = exercise.completedSets ? [...exercise.completedSets] : [];
      
      completedSets[setIndex] = !completedSets[setIndex];
      exercise.completedSets = completedSets;
      updatedExercises[exerciseIndex] = exercise;

      return {
        ...prev,
        activeWorkout: {
          ...prev.activeWorkout,
          exercises: updatedExercises,
        },
        xp: prev.xp + 5,
      };
    });
  };

  const startWorkout = () => {
    setState((prev) => ({
      ...prev,
      workoutActive: true,
      workoutCompleted: false,
      workoutStartTime: Date.now(),
    }));
  };

  const finishWorkout = async () => {
    let xpEarned = 100;
    let coinsEarned = 15;
    
    setState((prev) => {
      if (!prev.activeWorkout) return prev;
      
      xpEarned = prev.activeWorkout.kcal + 50;
      coinsEarned = Math.round(prev.activeWorkout.kcal / 10);
      const newTotalXp = prev.xp + xpEarned;
      const newTotalCoins = prev.coins + coinsEarned;
      const newLevel = Math.floor(newTotalXp / 300) + 1;
      const isLevelUp = newLevel > prev.level;
      
      const newLog: ActivityLog = {
        id: Date.now().toString(),
        type: "workout",
        title: `Completed ${prev.activeWorkout.name}`,
        desc: `${prev.activeWorkout.exercises.length} exercises · ${prev.activeWorkout.kcal} kcal`,
        time: "Now",
      };

      const updatedStreakDays = prev.streakDays.map((d, index) => {
        if (index === 4) return { ...d, done: true };
        return d;
      });

      const milestoneNotif: NotificationItem = {
        id: Date.now().toString(),
        title: "Workout Completed! 🏆",
        desc: `Earned +${xpEarned} XP and +${coinsEarned} coins. Streak: ${prev.workoutStreak + 1} days!`,
        time: "Now",
        unread: true,
        category: "workout",
      };

      let levelUpNotif: NotificationItem | null = null;
      if (isLevelUp) {
        levelUpNotif = {
          id: (Date.now() + 1).toString(),
          title: `Leveled Up to Lvl ${newLevel}! 🎉`,
          desc: "You unlocked the consistency king achievement badge!",
          time: "Now",
          unread: true,
          category: "social",
        };
      }

      const newLeaderboard = prev.leaderboard.map((user) => {
        if (user.me) {
          return {
            ...user,
            workouts: user.workouts + 1,
            score: user.score + xpEarned,
          };
        }
        return user;
      }).sort((a, b) => b.score - a.score).map((user, idx) => ({ ...user, rank: idx + 1 }));

      return {
        ...prev,
        workoutActive: false,
        workoutCompleted: true,
        workoutStreak: prev.workoutStreak + 1,
        streakDays: updatedStreakDays,
        xp: newTotalXp,
        level: newLevel,
        coins: newTotalCoins,
        activityLogs: [newLog, ...prev.activityLogs],
        notifications: levelUpNotif 
          ? [levelUpNotif, milestoneNotif, ...prev.notifications] 
          : [milestoneNotif, ...prev.notifications],
        leaderboard: newLeaderboard,
      };
    });

    try {
      await api.post("/workout-session/finish", null, {
        params: {
          workout_id: "wkt-1",
          duration: 2700,
          calories: 420,
          completed_pct: 100.0
        }
      });
    } catch (err) {
      console.warn("Failed to sync session completion to backend:", err);
    }
  };

  const cancelWorkout = () => {
    setState((prev) => ({
      ...prev,
      workoutActive: false,
      workoutStartTime: null,
    }));
  };

  const generateAIWorkout = (params: { goal: string; time: number; equip: string[]; difficulty: string }) => {
    setState((prev) => {
      const kcalBurn = Math.round(params.time * 9);
      const isHypertrophy = params.goal.toLowerCase().includes("muscle");
      const name = isHypertrophy ? "AI Hypertrophy Split" : "AI Cardio Shred";
      
      const newExercises: WorkoutExercise[] = [
        { name: isHypertrophy ? "Dumbbell Chest Press" : "Jumping Jacks", sets: 3, reps: isHypertrophy ? "10–12" : "45s", rest: 45, kcal: 80, muscle: isHypertrophy ? "Chest" : "Full Body", completedSets: [false, false, false] },
        { name: isHypertrophy ? "Goblet Squats" : "Kettlebell Swings", sets: 3, reps: isHypertrophy ? "12–15" : "20 reps", rest: 60, kcal: 110, muscle: "Lower Body", completedSets: [false, false, false] },
        { name: isHypertrophy ? "Lat Pulldown (Dumbbell Row)" : "Mountain Climbers", sets: 3, reps: "12", rest: 45, kcal: 70, muscle: "Back", completedSets: [false, false, false] },
      ];

      const customWorkout: Workout = {
        name,
        duration: params.time,
        kcal: kcalBurn,
        difficulty: params.difficulty,
        whySelected: `Based on your goal (${params.goal}), current recovery score of ${prev.recoveryScore}%, and equipment availability (${params.equip.join(", ")}), this program maximizes metabolic stress in ${params.time} minutes with safe joint loading.`,
        exercises: newExercises,
      };

      const newCoachMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "coach",
        text: `I've successfully generated a custom workout: **${name}** (${params.time} mins). It's focused on ${params.goal} with a moderate difficulty of ${params.difficulty}. Check it out in the Workout tab!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      return {
        ...prev,
        activeWorkout: customWorkout,
        aiWorkoutPlans: [customWorkout, ...prev.aiWorkoutPlans],
        chatHistory: [...prev.chatHistory, newCoachMessage],
      };
    });
  };

  const addChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setState((prev) => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMsg],
    }));

    try {
      const res = await api.post("/coach/chat", { message: text });
      const coachMsg: ChatMessage = {
        id: res.data.id,
        sender: "coach",
        text: res.data.text,
        timestamp: new Date(res.data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setState((prev) => ({
        ...prev,
        chatHistory: [...prev.chatHistory, coachMsg]
      }));
    } catch (err) {
      console.warn("Failed to sync coach chat to backend, utilizing simulated replies:", err);
      // Fallback
      setState((prev) => {
        let coachResponse = "";
        const query = text.toLowerCase();
        if (query.includes("recovery") || query.includes("sleep")) {
          coachResponse = `Your recovery is currently at ${prev.recoveryScore}% thanks to a solid 7h 45m sleep. I'd suggest a moderate resistance training or active recovery session today.`;
        } else if (query.includes("workout") || query.includes("generate")) {
          coachResponse = "I can definitely customize a plan for you! Head over to the 'Workout' page and tap 'Customize'.";
        } else if (query.includes("nutrition") || query.includes("protein")) {
          coachResponse = `Currently, you've logged ${prev.caloriesToday} kcal and ${prev.proteinToday}g of protein today. try adding 20g of protein tonight.`;
        } else {
          coachResponse = "Consistency is the key to premium performance. Let me know if you want me to adjust today's workout sets or review your nutrition macros.";
        }

        const coachMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "coach",
          text: coachResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        return {
          ...prev,
          chatHistory: [...prev.chatHistory, coachMsg],
        };
      });
    }
  };

  const claimDailyReward = () => {
    setState((prev) => {
      const rewardNotif: NotificationItem = {
        id: Date.now().toString(),
        title: "Daily Reward Claimed! 🪙",
        desc: "You received +50 Coins and +10 XP for checking in today.",
        time: "Now",
        unread: true,
        category: "social",
      };

      return {
        ...prev,
        coins: prev.coins + 50,
        xp: prev.xp + 10,
        notifications: [rewardNotif, ...prev.notifications],
      };
    });
  };

  const resetAppState = () => {
    setState(DEFAULT_STATE);
  };

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        updateProfile,
        toggleGoal,
        toggleEquipment,
        addWater,
        removeWater,
        logMeal,
        dismissNotification,
        clearAllNotifications,
        completeSet,
        startWorkout,
        finishWorkout,
        cancelWorkout,
        generateAIWorkout,
        addChatMessage,
        claimDailyReward,
        resetAppState,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
