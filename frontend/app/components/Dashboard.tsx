import React, { useState, useEffect } from "react";
import { 
  Bell, Dumbbell, Coffee, Droplet, Flame, Heart, Activity, 
  Moon, Trophy, Sparkles, ChevronRight, Award, Info, 
  CalendarDays, Star, Check, User, Settings, LogOut, Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { useAuth } from "../context/AuthContext";

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  openMealModal: () => void;
  openNotificationsModal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, openMealModal, openNotificationsModal }) => {
  const {
    profile,
    recoveryScore,
    workoutStreak,
    streakDays,
    caloriesToday,
    proteinToday,
    carbsToday,
    waterToday,
    notifications,
    activityLogs,
    leaderboard,
    addWater,
    removeWater,
    dismissNotification,
    clearAllNotifications,
  } = useAppState();
  const { user, logout } = useAuth();

  const [liveBpm, setLiveBpm] = useState(78);
  const [liveCal, setLiveCal] = useState(380);
  const [liveSteps, setLiveSteps] = useState(6240);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  let loggedInUser = user;
  if (!loggedInUser) {
    try {
      const stored = localStorage.getItem("fitaix_user");
      if (stored) loggedInUser = JSON.parse(stored);
    } catch (e) {}
  }
  const userName = loggedInUser?.name || (profile.name !== "Priyanshi Sharma" ? profile.name : "") || "Athlete";
  const displayName = userName.split(" ")[0];

  // Dynamic Real-Time Date & Greeting Calculations
  const now = new Date();
  const hours = now.getHours();
  const timeGreeting = hours < 12 ? "Good morning" : hours < 17 ? "Good afternoon" : "Good evening";
  const todayFormatted = now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  // Generate Real-Time Current Week Calendar (Mon - Sun)
  const getWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    return labels.map((label, idx) => {
      const d = new Date(today);
      d.setDate(today.getDate() + mondayOffset + idx);
      const isToday = d.toDateString() === today.toDateString();
      const isPast = d < today && !isToday;
      return {
        day: label,
        date: d.getDate(),
        isToday,
        isPast,
      };
    });
  };

  const weekDays = getWeekDays();
  const [selectedDay, setSelectedDay] = useState<string>(
    weekDays.find((d) => d.isToday)?.day || "Mon"
  );

  // Dynamic Real-Time Streak Days based on actual day of week
  const realStreakDays = weekDays.map((d) => ({
    day: d.day[0],
    done: d.isPast || d.isToday,
    isToday: d.isToday,
  }));

  // Live Heart Rate & Step Tracker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBpm(Math.floor(72 + Math.sin(Date.now() / 3000) * 5 + Math.random() * 2));
      setLiveSteps((prev) => prev + (Math.random() > 0.5 ? Math.floor(Math.random() * 3 + 1) : 0));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Circle progress calculation helper
  const getCircumference = (radius: number) => 2 * Math.PI * radius;
  const strokeDashoffset = (percent: number, radius: number) => {
    const circ = getCircumference(radius);
    return circ - (Math.min(percent, 100) / 100) * circ;
  };

  // Dynamic nutrition percentages
  const calPct = Math.round((caloriesToday / 2200) * 100);
  const proteinPct = Math.round((proteinToday / 140) * 100);
  const carbsPct = Math.round((carbsToday / 220) * 100);

  return (
    <div className="flex-grow flex flex-col min-h-0 overflow-y-auto no-scrollbar relative bg-[#0A0A0A] text-white px-5 pt-1.5 pb-24">
      
      {/* 1. TOP HEADERBAR */}
      <div className="flex justify-between items-center mt-2 mb-4 relative z-30">
        <div>
          <span className="text-[12px] text-[#B0AA9A] font-semibold block">{todayFormatted} · {timeGreeting}</span>
          <h2 className="text-[20px] font-extrabold text-white mt-0.5 leading-tight">Welcome, {displayName} 👋</h2>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={openNotificationsModal}
            className="w-9 h-9 rounded-full bg-[#161616] flex items-center justify-center text-[#B0AA9A] relative cursor-pointer hover:text-white border border-white/[0.03] active:scale-95 transition"
            title="Open Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#EF4444] text-[9px] font-extrabold w-[15px] h-[15px] rounded-full flex items-center justify-center border-2 border-[#0A0A0A] text-white">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Profile Dropdown Trigger & Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FFB300] to-[#F5C400] text-black font-extrabold text-[12.5px] flex items-center justify-center cursor-pointer hover:opacity-90 transition shadow-md border border-gold/30"
            >
              {displayName.charAt(0).toUpperCase()}
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2 w-48 bg-[#161616] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5"
                >
                  <div className="px-3.5 py-2 border-b border-white/10">
                    <p className="text-xs font-extrabold text-white truncate">{userName}</p>
                    <p className="text-[10px] text-[#B0AA9A] truncate">{user?.email || profile.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab("profile");
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-white hover:bg-white/5 flex items-center gap-2 transition font-medium"
                  >
                    <User className="w-4 h-4 text-gold" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab("profile");
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-white hover:bg-white/5 flex items-center gap-2 transition font-medium"
                  >
                    <Settings className="w-4 h-4 text-gold" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab("profile");
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-white hover:bg-white/5 flex items-center gap-2 transition font-medium"
                  >
                    <Award className="w-4 h-4 text-gold" />
                    <span>Edit Profile</span>
                  </button>

                  <div className="border-t border-white/10 my-1"></div>

                  <button
                    onClick={async () => {
                      setShowProfileMenu(false);
                      await logout();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S AI WORKOUT */}
      <div
        onClick={() => setActiveTab("workout")}
        className="flex items-center gap-3 bg-gradient-to-r from-[#2a2210] to-[#171310] border border-[#F5C400]/18 rounded-[18px] p-3.5 cursor-pointer hover:border-gold/40 transition-all duration-300"
      >
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Dumbbell className="w-[22px] h-[22px] text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] text-[#D6D0FF] font-bold block uppercase tracking-wider">TODAY'S AI WORKOUT</span>
          <h3 className="text-[14.5px] font-extrabold text-white mt-0.5 leading-none">Push Strength</h3>
          <p className="text-[10.5px] text-[#D6D0FF] mt-1.5 leading-none">45 min · 6 exercises</p>
        </div>
        <div className="w-8.5 h-8.5 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
          <ChevronRight className="w-[15px] h-[15px]" />
        </div>
      </div>

      {/* 3. RECOVERY SCORE & WORKOUT STREAK GRID */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        {/* Recovery Score */}
        <div className="bg-[#161616] border border-white/[0.09] rounded-2xl p-3.5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11.5px] text-[#B0AA9A] font-semibold">Recovery Score</span>
            <Activity className="w-[15px] h-[15px] text-[#A3E635]" />
          </div>
          <div className="flex items-center gap-2.5 mt-2">
            <div className="w-[46px] h-[46px] relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="23" cy="23" r="19" stroke="#241F14" strokeWidth="5" fill="transparent" />
                <circle cx="23" cy="23" r="19" stroke="var(--color-green-450)" strokeWidth="5" fill="transparent"
                  strokeDasharray={getCircumference(19)}
                  strokeDashoffset={strokeDashoffset(recoveryScore, 19)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[11px] text-white">
                {recoveryScore}
              </div>
            </div>
            <div>
              <div className="text-[14px] font-extrabold text-white">Excellent</div>
              <div className="text-[10px] text-[#B0AA9A] mt-0.5">Ready to train</div>
            </div>
          </div>
        </div>

        {/* Real-Time Workout Streak */}
        <div className="bg-[#161616] border border-white/[0.09] rounded-2xl p-3.5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11.5px] text-[#B0AA9A] font-semibold">Workout Streak</span>
            <Flame className="w-[15px] h-[15px] text-[#F59E0B]" />
          </div>
          <div className="text-[19px] font-extrabold text-white">
            {workoutStreak} <small className="text-[11px] text-[#B0AA9A] font-semibold">days</small>
          </div>
          <div className="flex gap-1.5 mt-2.5">
            {realStreakDays.map((day, idx) => (
              <div key={idx} className="flex-1 text-center">
                <div
                  className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-bold mx-auto mb-1 ${
                    day.done
                      ? "bg-gradient-to-br from-[#F59E0B] to-[#C2410C] text-white shadow-sm shadow-orange-500/20"
                      : "bg-[#101010] text-[#B0AA9A]"
                  } ${day.isToday ? "ring-2 ring-gold" : ""}`}
                >
                  {day.done ? "✓" : day.day}
                </div>
                <span className="text-[8.5px] text-[#B0AA9A] block leading-none">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. GOAL PROGRESS */}
      <div className="flex justify-between items-center mt-[18px] mb-2.5">
        <h3 className="text-[15px] font-bold text-white">Goal Progress</h3>
        <span className="text-[11.5px] text-[#F5C400] font-bold cursor-pointer">Manage</span>
      </div>
      <div className="bg-[#161616] border border-white/[0.09] rounded-[18px] p-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11.5px]">
            <span>Lose 5kg</span>
            <b className="font-bold text-white">64%</b>
          </div>
          <div className="h-[7px] bg-[#101010] rounded-full overflow-hidden">
            <div className="h-full bg-[#F5C400] rounded-full transition-all duration-700" style={{ width: "64%" }} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11.5px]">
            <span>Bench 90kg</span>
            <b className="font-bold text-white">81%</b>
          </div>
          <div className="h-[7px] bg-[#101010] rounded-full overflow-hidden">
            <div className="h-full bg-[#CA8A04] rounded-full transition-all duration-700" style={{ width: "81%" }} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11.5px]">
            <span>Run 10km</span>
            <b className="font-bold text-white">42%</b>
          </div>
          <div className="h-[7px] bg-[#101010] rounded-full overflow-hidden">
            <div className="h-full bg-[#FDE68A] rounded-full transition-all duration-700" style={{ width: "42%" }} />
          </div>
        </div>
      </div>

      {/* 5. REAL-TIME CALORIES & NUTRITION */}
      <div className="flex justify-between items-center mt-[18px] mb-2.5">
        <h3 className="text-[15px] font-bold text-white">Calories & Nutrition</h3>
        <span onClick={openMealModal} className="text-[11.5px] text-[#F5C400] font-bold cursor-pointer">Log Meal</span>
      </div>
      <div className="bg-[#161616] border border-white/[0.09] rounded-[18px] p-4">
        <div className="flex justify-around items-center">
          <div className="text-center flex flex-col items-center">
            <div className="w-[46px] h-[46px] relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="23" cy="23" r="19" stroke="#241F14" strokeWidth="5" fill="transparent" />
                <circle cx="23" cy="23" r="19" stroke="#F59E0B" strokeWidth="5" fill="transparent"
                  strokeDasharray={getCircumference(19)}
                  strokeDashoffset={strokeDashoffset(calPct, 19)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[10.5px]">
                {(caloriesToday / 1000).toFixed(1)}k
              </div>
            </div>
            <span className="text-[9.5px] text-[#B0AA9A] font-bold mt-1.5 block">Calories</span>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="w-[46px] h-[46px] relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="23" cy="23" r="19" stroke="#241F14" strokeWidth="5" fill="transparent" />
                <circle cx="23" cy="23" r="19" stroke="#A3E635" strokeWidth="5" fill="transparent"
                  strokeDasharray={getCircumference(19)}
                  strokeDashoffset={strokeDashoffset(proteinPct, 19)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[10.5px]">
                {proteinPct}%
              </div>
            </div>
            <span className="text-[9.5px] text-[#B0AA9A] font-bold mt-1.5 block">Protein</span>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="w-[46px] h-[46px] relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="23" cy="23" r="19" stroke="#241F14" strokeWidth="5" fill="transparent" />
                <circle cx="23" cy="23" r="19" stroke="#F5C400" strokeWidth="5" fill="transparent"
                  strokeDasharray={getCircumference(19)}
                  strokeDashoffset={strokeDashoffset(carbsPct, 19)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[10.5px]">
                {carbsPct}%
              </div>
            </div>
            <span className="text-[9.5px] text-[#B0AA9A] font-bold mt-1.5 block">Carbs</span>
          </div>
        </div>
      </div>

      {/* 6. WATER INTAKE */}
      <div className="flex justify-between items-center mt-[18px] mb-2.5">
        <h3 className="text-[15px] font-bold text-white">Water Intake</h3>
        <span className="text-[11.5px] text-[#FFD60A] font-bold">{waterToday} / 2.8L</span>
      </div>
      <div className="bg-[#161616] border border-white/[0.09] rounded-[18px] p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={removeWater}
            className="w-8 h-8 rounded-full border border-white/[0.09] bg-[#101010] text-white font-extrabold flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          >
            −
          </button>
          <div className="flex-grow h-2 bg-[#101010] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-[#FDE68A] rounded-full transition-all duration-300" style={{ width: `${(waterToday / 2.8) * 100}%` }} />
          </div>
          <button
            onClick={addWater}
            className="w-8 h-8 rounded-full border border-white/[0.09] bg-[#101010] text-white font-extrabold flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* 7. AI SUGGESTIONS */}
      <div className="flex justify-between items-center mt-[18px] mb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold" />
          <h3 className="text-[15px] font-bold text-white">AI Suggestions & Live Insights</h3>
        </div>
        <span className="text-[10px] font-extrabold text-gold bg-gold/15 border border-gold/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Live AI
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {/* Card 1: Recovery Tip */}
        <div className="shrink-0 w-[265px] bg-[#161616] border border-gold/30 rounded-2xl p-4 shadow-lg flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#FFD60A]">
                <Star className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span>Recovery & CNS Tip</span>
              </div>
              <span className="text-[9.5px] font-extrabold text-lime-400 bg-lime-400/10 px-1.5 py-0.5 rounded border border-lime-400/20">
                {recoveryScore}% Score
              </span>
            </div>
            <p className="text-[11.5px] text-[#D4CEBF] leading-relaxed font-medium">
              {recoveryScore > 85
                ? "CNS readiness is high! Your body is fully recovered and primed for heavy hypertrophic push loading today."
                : `HRV recovery stands at ${recoveryScore}%. Consider a lighter 8-min mobility warmup before starting your workout.`}
            </p>
          </div>
          <div className="mt-3 text-[10px] font-bold text-[#F5C400] flex items-center gap-1">
            <span>Action:</span>
            <span className="text-white font-semibold">
              {recoveryScore > 85 ? "Target Progressive Overload" : "Focus on Strict Form"}
            </span>
          </div>
        </div>

        {/* Card 2: Nutrition & Protein Tip */}
        <div className="shrink-0 w-[265px] bg-[#161616] border border-gold/30 rounded-2xl p-4 shadow-lg flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#FFD60A]">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span>Nutrition & Macros</span>
              </div>
              <span className="text-[9.5px] font-extrabold text-gold bg-gold/10 px-1.5 py-0.5 rounded border border-gold/20">
                {proteinToday}g / 120g
              </span>
            </div>
            <p className="text-[11.5px] text-[#D4CEBF] leading-relaxed font-medium">
              {proteinToday < 120
                ? `Logged ${proteinToday}g protein today. A 25g whey shake or Greek yogurt tonight will hit your daily muscle target!`
                : `Protein goal achieved (${proteinToday}g logged)! Muscle protein synthesis is fully supported for chest repair.`}
            </p>
          </div>
          <div className="mt-3 text-[10px] font-bold text-[#F5C400] flex items-center gap-1">
            <span>Recommendation:</span>
            <span className="text-white font-semibold">
              {proteinToday < 120 ? "Add High-Protein Snack" : "Macro Target Met"}
            </span>
          </div>
        </div>

        {/* Card 3: Hydration Insight */}
        <div className="shrink-0 w-[265px] bg-[#161616] border border-cyan-400/30 rounded-2xl p-4 shadow-lg flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-400">
                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hydration Status</span>
              </div>
              <span className="text-[9.5px] font-extrabold text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20">
                {waterToday} / 2.8L
              </span>
            </div>
            <p className="text-[11.5px] text-[#D4CEBF] leading-relaxed font-medium">
              {waterToday < 2.8
                ? `Logged ${waterToday}L water today. Drink another 0.4L to optimize ATP synthesis and muscle endurance!`
                : `Hydration target achieved (${waterToday}L logged) 💧! Joint lubrication and cellular hydration are optimal.`}
            </p>
          </div>
          <div className="mt-3 text-[10px] font-bold text-cyan-400 flex items-center gap-1">
            <span>Hydration Level:</span>
            <span className="text-white font-semibold">
              {waterToday < 2.8 ? "Add 1 Glass of Water" : "Optimal Cellular Hydration"}
            </span>
          </div>
        </div>

        {/* Card 4: Streak & Gamification Alert */}
        <div className="shrink-0 w-[265px] bg-[#161616] border border-amber-500/30 rounded-2xl p-4 shadow-lg flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Streak & XP Booster</span>
              </div>
              <span className="text-[9.5px] font-extrabold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                🔥 {workoutStreak} Days
              </span>
            </div>
            <p className="text-[11.5px] text-[#D4CEBF] leading-relaxed font-medium">
              You are on a {workoutStreak}-day workout streak 🔥! Completing today's recommended session unlocks +150 XP and 15 coins.
            </p>
          </div>
          <div className="mt-3 text-[10px] font-bold text-amber-400 flex items-center gap-1">
            <span>Reward Ready:</span>
            <span className="text-white font-semibold">+150 XP Available</span>
          </div>
        </div>
      </div>

      {/* 8. WEEKLY CALENDAR */}
      <div className="flex justify-between items-center mt-[18px] mb-2.5">
        <h3 className="text-[15px] font-bold text-white">Weekly Calendar</h3>
        <span className="text-[11.5px] text-[#F5C400] font-bold">This Week</span>
      </div>
      <div className="bg-[#161616] border border-white/[0.09] rounded-[18px] p-3.5">
        <div className="flex justify-between gap-1">
          {weekDays.map((dayItem, idx) => {
            const isSelected = selectedDay === dayItem.day;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(dayItem.day)}
                className={`flex-1 text-center py-2.5 rounded-[14px] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-tr from-[#F5C400] to-[#FFD60A] text-black shadow-md shadow-amber-500/20"
                    : dayItem.isToday
                    ? "bg-[#101010] text-gold border border-gold/40"
                    : "text-[#B0AA9A] hover:text-white"
                }`}
              >
                <div className={`text-[9.5px] font-bold ${isSelected ? "text-black" : "text-[#B0AA9A]"}`}>{dayItem.day}</div>
                <div className="text-[13px] font-extrabold mt-1.5">{dayItem.date}</div>
                {dayItem.isToday && !isSelected && (
                  <div className="w-1.5 h-1.5 bg-[#F5C400] rounded-full mx-auto mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 9. RECENT ACTIVITY FEED */}
      <div className="flex justify-between items-center mt-[18px] mb-2.5">
        <h3 className="text-[15px] font-bold text-white">Recent Activity</h3>
        <span className="text-[11.5px] text-[#F5C400] font-bold cursor-pointer">View All</span>
      </div>
      <div className="bg-[#161616] border border-white/[0.09] rounded-[18px] p-4 flex flex-col">
        {activityLogs.map((log, idx) => (
          <div key={log.id} className={`flex items-center gap-2.5 py-2.5 ${idx !== activityLogs.length - 1 ? "border-b border-white/[0.09]" : ""}`}>
            <div className="w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: log.type === "workout" ? "rgba(245,196,0,.15)" : "rgba(163,230,53,.15)",
                color: log.type === "workout" ? "#F5C400" : "#A3E635"
              }}
            >
              {log.type === "workout" ? <Dumbbell className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-[12px] font-bold text-white block">{log.title}</b>
              <span className="text-[10px] text-[#B0AA9A] block mt-0.5">{log.desc}</span>
            </div>
            <span className="text-[10px] text-[#B0AA9A] shrink-0">{log.time}</span>
          </div>
        ))}
      </div>

      {/* 10. LEADERBOARD */}
      <div className="flex justify-between items-center mt-[18px] mb-2.5">
        <h3 className="text-[15px] font-bold text-white">Leaderboard</h3>
        <span className="text-[11.5px] text-[#F5C400] font-bold cursor-pointer">Friends</span>
      </div>
      <div className="bg-[#161616] border border-white/[0.09] rounded-[18px] p-4 flex flex-col">
        {leaderboard.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center gap-2.5 py-2 ${
              user.me ? "bg-[#F5C400]/10 border border-gold/20 rounded-xl px-2.5 my-1" : ""
            }`}
          >
            <div className={`w-5 text-[12px] font-extrabold text-[#B0AA9A] text-center ${user.rank === 1 ? "text-[#FFD60A]" : ""}`}>
              {user.rank}
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0"
              style={{
                background: user.me
                  ? "linear-gradient(135deg,#FFB300,var(--color-gold))"
                  : "linear-gradient(135deg,#CA8A04,#FDE68A)"
              }}
            >
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-[12px] font-bold text-white block">{user.name}</b>
              <span className="text-[9.5px] text-[#B0AA9A] block mt-0.5">{user.workouts} workouts</span>
            </div>
            <div className="text-[12px] font-extrabold text-[#F5C400] shrink-0">{user.score}</div>
          </div>
        ))}
      </div>

      {/* 11. QUICK ACTIONS */}
      <div className="flex justify-between items-center mt-[18px] mb-2.5">
        <h3 className="text-[15px] font-bold text-white">Quick Actions</h3>
      </div>
      <div className="bg-[#161616] border border-white/[0.09] rounded-[18px] p-4">
        <div className="grid grid-cols-4 gap-2.5">
          <div onClick={() => setActiveTab("workout")} className="text-center cursor-pointer group">
            <div className="w-13 h-13 rounded-2xl bg-[#101010] flex items-center justify-center mx-auto mb-1.5 transition-transform duration-300 group-active:scale-90 text-[#F5C400] border border-white/[0.03]">
              <Dumbbell className="w-[22px] h-[22px]" />
            </div>
            <span className="text-[9.5px] text-[#B0AA9A] font-bold block">Log Workout</span>
          </div>

          <div onClick={openMealModal} className="text-center cursor-pointer group">
            <div className="w-13 h-13 rounded-2xl bg-[#101010] flex items-center justify-center mx-auto mb-1.5 transition-transform duration-300 group-active:scale-90 text-[#F59E0B] border border-white/[0.03]">
              <Coffee className="w-[22px] h-[22px]" />
            </div>
            <span className="text-[9.5px] text-[#B0AA9A] font-bold block">Log Meal</span>
          </div>

          <div onClick={addWater} className="text-center cursor-pointer group">
            <div className="w-13 h-13 rounded-2xl bg-[#101010] flex items-center justify-center mx-auto mb-1.5 transition-transform duration-300 group-active:scale-90 text-cyan-400 border border-white/[0.03]">
              <Droplet className="w-[22px] h-[22px]" />
            </div>
            <span className="text-[9.5px] text-[#B0AA9A] font-bold block">Add Water</span>
          </div>

          <div onClick={() => setActiveTab("nutrition")} className="text-center cursor-pointer group">
            <div className="w-13 h-13 rounded-2xl bg-[#101010] flex items-center justify-center mx-auto mb-1.5 transition-transform duration-300 group-active:scale-90 text-[#A3E635] border border-white/[0.03]">
              <Camera className="w-[22px] h-[22px]" />
            </div>
            <span className="text-[9.5px] text-[#B0AA9A] font-bold block">Scan Food</span>
          </div>
        </div>
      </div>

      {/* 12. LIVE STATISTICS */}
      <div className="flex justify-between items-center mt-[18px] mb-2.5">
        <h3 className="text-[15px] font-bold text-white">Live Statistics</h3>
        <span className="flex items-center gap-1 text-[11.5px] text-[#A3E635] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-ping" />
          <span>Live</span>
        </span>
      </div>
      <div className="bg-[#161616] border border-white/[0.09] rounded-[18px] p-4">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-[17px] font-extrabold text-white">{liveSteps}</div>
            <div className="text-[9.5px] text-[#B0AA9A] mt-0.5">Steps</div>
          </div>
          <div>
            <div className="text-[17px] font-extrabold text-white">42</div>
            <div className="text-[9.5px] text-[#B0AA9A] mt-0.5">Active Min</div>
          </div>
          <div>
            <div className="text-[17px] font-extrabold text-white">{liveBpm}</div>
            <div className="text-[9.5px] text-[#B0AA9A] mt-0.5">BPM Now</div>
          </div>
        </div>
      </div>

      {/* 13. ACTIVE CHALLENGES */}
      <div className="flex justify-between items-center mt-[18px] mb-2.5">
        <h3 className="text-[15px] font-bold text-white">Active Challenges</h3>
        <span className="text-[11.5px] text-[#F5C400] font-bold cursor-pointer">Browse</span>
      </div>
      <div className="bg-[#161616] border border-white/[0.09] rounded-[18px] p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/15 text-[#FFB300] flex items-center justify-center shrink-0">
            <Trophy className="w-[18px] h-[18px]" />
          </div>
          <div className="flex-1 min-w-0">
            <b className="text-[12px] font-bold text-white block">30 Workouts in 30 Days</b>
            <div className="h-1.5 bg-[#101010] rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-gradient-to-r from-[#FFB300] to-[#F5C400] rounded-full" style={{ width: "73%" }} />
            </div>
            <div className="text-[9.5px] text-[#B0AA9A] mt-1">22/30 · 8 days left</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/15 text-[#FFB300] flex items-center justify-center shrink-0">
            <Droplet className="w-[18px] h-[18px]" />
          </div>
          <div className="flex-grow min-w-0">
            <b className="text-[12px] font-bold text-white block">Hydration Streak</b>
            <div className="h-1.5 bg-[#101010] rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-[#FDE68A] rounded-full" style={{ width: "90%" }} />
            </div>
            <div className="text-[9.5px] text-[#B0AA9A] mt-1">9/10 days · 1 day left</div>
          </div>
        </div>
      </div>

      {/* 14. NOTIFICATIONS */}
      <div className="flex justify-between items-center mt-[18px] mb-2.5">
        <h3 className="text-[15px] font-bold text-white">Notifications</h3>
        <span onClick={clearAllNotifications} className="text-[11.5px] text-[#F5C400] font-bold cursor-pointer">Clear All</span>
      </div>
      <div className="bg-[#161616] border border-white/[0.09] rounded-[18px] p-4 flex flex-col">
        {notifications.map((n, idx) => (
          <div key={n.id} className={`flex items-start gap-2.5 py-2.5 relative ${n.unread ? "pl-2" : ""} ${idx !== notifications.length - 1 ? "border-b border-white/[0.09]" : ""}`}>
            {n.unread && (
              <span className="absolute left-[-6px] top-4.5 w-1.5 h-1.5 rounded-full bg-[#F5C400]" />
            )}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: n.category === "recovery" ? "rgba(245,196,0,.15)" : n.category === "social" ? "rgba(255,179,0,.15)" : "rgba(163,230,53,.15)",
                color: "#F5C400"
              }}
            >
              {n.category === "recovery" ? <Star className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-[11.5px] font-bold text-white block leading-tight">{n.title}</b>
              <span className="text-[10px] text-[#B0AA9A] block mt-0.5 leading-snug">{n.desc}</span>
            </div>
            <span className="text-[9.5px] text-[#B0AA9A] shrink-0 ml-1">{n.time}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
