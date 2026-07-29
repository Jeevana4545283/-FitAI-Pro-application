"use client";

import React, { useState, useEffect } from "react";
import { Calendar, ChevronLeft, Award, Sparkles, TrendingDown, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppState } from "../context/AppStateContext";

interface AnalyticsProps {
  setActiveTab: (tab: string) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ setActiveTab }) => {
  const {
    streakDays,
    workoutStreak,
    profile,
    caloriesToday,
    proteinToday,
    waterToday,
    xp,
    level,
    activityLogs,
  } = useAppState();

  const [timeRange, setTimeRange] = useState("30D");

  // Dynamic real-time performance analytics computed from state
  const workoutsCompletedCount = activityLogs.filter((a) => a.type === "workout").length;
  const proteinPct = Math.min(100, Math.round((proteinToday / 140) * 100));
  const calPct = Math.min(100, Math.round((caloriesToday / 2200) * 100));
  const waterPct = Math.min(100, Math.round((waterToday / 2.8) * 100));

  // Animation count-up state
  const [fitnessScore, setFitnessScore] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Trigger count-up numbers based on user level & workouts completed
  useEffect(() => {
    const targetScore = Math.min(98, 70 + (workoutStreak * 2));
    const targetComp = Math.min(100, Math.max(50, 60 + (workoutsCompletedCount * 5)));

    let fs = 0;
    const fsTimer = setInterval(() => {
      fs += 1;
      if (fs >= targetScore) {
        setFitnessScore(targetScore);
        clearInterval(fsTimer);
      } else {
        setFitnessScore(fs);
      }
    }, 12);

    let comp = 0;
    const compTimer = setInterval(() => {
      comp += 1;
      if (comp >= targetComp) {
        setCompletionPercentage(targetComp);
        clearInterval(compTimer);
      } else {
        setCompletionPercentage(comp);
      }
    }, 15);

    return () => {
      clearInterval(fsTimer);
      clearInterval(compTimer);
    };
  }, [workoutStreak, workoutsCompletedCount]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-app-bg text-white overflow-y-auto no-scrollbar pb-24 px-5 pt-2">
      
      {/* Header */}
      <div className="flex justify-between items-center mt-2 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("home")}
            className="w-8.5 h-8.5 flex items-center justify-center text-text-sec hover:text-white cursor-pointer active:scale-90 transition-all"
          >
            <ChevronLeft className="w-5.5 h-5.5 stroke-[2.3]" />
          </button>
          <h2 className="text-[19px] font-extrabold text-white">Progress & Analytics</h2>
        </div>
        <button className="w-[38px] h-[38px] rounded-xl bg-app-card border border-white/[0.09] flex items-center justify-center text-text-sec hover:text-white cursor-pointer active:scale-95 transition-all">
          <Calendar className="w-4.5 h-4.5 stroke-[2]" />
        </button>
      </div>

      {/* Time Range Selector */}
      <div className="flex bg-app-card border border-white/[0.09] rounded-xl p-1 mb-4 select-none">
        {["7D", "30D", "90D", "1Y"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`flex-1 text-center py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
              timeRange === range
                ? "bg-gold-gradient text-white shadow"
                : "text-text-sec hover:text-white"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Fitness Score Card */}
      <div className="bg-app-card border border-white/[0.09] rounded-3xl p-5 mb-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <span className="text-[12px] font-bold text-text-sec uppercase tracking-wider">Fitness Score</span>
            <div className="text-3xl font-extrabold text-white mt-1">
              {fitnessScore}<small className="text-sm text-text-sec font-semibold">/100</small>
            </div>
            <span className="text-[11.5px] font-bold text-lime-accent block mt-1">Great Progress! 🔥</span>
          </div>

          {/* Radial animated ring */}
          <div className="relative w-[88px] h-[88px] shrink-0">
            <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
              <circle cx="44" cy="44" r="37" fill="none" stroke="#241F14" strokeWidth="6" />
              <motion.circle
                cx="44"
                cy="44"
                r="37"
                fill="none"
                stroke="url(#fsGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="232"
                initial={{ strokeDashoffset: 232 }}
                animate={{ strokeDashoffset: 232 - (232 * 85) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="fsGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#F5C400" />
                  <stop offset="100%" stop-color="#FDE68A" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[20px]">
              {fitnessScore}
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end shrink-0 ml-3 text-right">
            <div className="flex items-center gap-1.5 text-[10.5px] text-text-sec font-bold">
              <span>{workoutStreak} Days</span>
              <span className="w-1.5 h-1.5 bg-gold rounded-full" />
            </div>
            <div className="text-[10px] text-text-sec font-bold leading-tight">
              <span className="text-white block text-[11.5px]">5 / 6</span> Workouts
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Custom SVG Charts */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        
        {/* Weight Progress Line Chart */}
        <div className="bg-app-card border border-white/[0.09] rounded-2xl p-4 flex flex-col justify-between h-[156px]">
          <div className="flex justify-between items-start">
            <h4 className="text-[12px] font-bold text-white tracking-wide">Weight</h4>
            <span className="text-[9.5px] font-bold text-lime-accent flex items-center shrink-0">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              <span>2.8 kg</span>
            </span>
          </div>
          <div className="text-lg font-extrabold text-white leading-none">68.4 <small className="text-[11px] text-text-sec font-bold">kg</small></div>
          
          {/* Custom SVG Line Chart */}
          <div className="h-12 w-full my-1.5">
            <svg width="100%" height="100%" viewBox="0 0 150 46" preserveAspectRatio="none" className="overflow-visible">
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#FFB300" stopOpacity="0.25" />
                  <stop offset="100%" stop-color="#FFB300" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,30 L20,38 L40,18 L60,32 L80,12 L100,24 L120,8 L150,22 L150,46 L0,46 Z"
                fill="url(#weightGrad)"
              />
              <motion.polyline
                points="0,30 20,38 40,18 60,32 80,12 100,24 120,8 150,22"
                fill="none"
                stroke="#FFB300"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
          </div>
          <div className="flex justify-between text-[8px] text-text-sec font-bold">
            <span>Apr 22</span>
            <span>May 20</span>
          </div>
        </div>

        {/* Strength Progress Radar Chart */}
        <div className="bg-app-card border border-white/[0.09] rounded-2xl p-4 flex flex-col justify-between h-[156px]">
          <div className="flex justify-between items-start">
            <h4 className="text-[12px] font-bold text-white tracking-wide">Strength</h4>
            <span className="text-[9.5px] font-bold text-lime-accent flex items-center shrink-0">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              <span>+18%</span>
            </span>
          </div>
          
          {/* Custom SVG Radar Chart */}
          <div className="h-24 w-full flex items-center justify-center relative my-1">
            <svg width="84" height="84" viewBox="0 0 100 100" className="overflow-visible">
              {/* Outer boundary octagon */}
              <polygon points="50,8 90,34 76,86 24,86 10,34" fill="none" stroke="#241F14" strokeWidth="1.2" />
              {/* Inner boundary octagon */}
              <polygon points="50,26 72,42 64,72 36,72 28,42" fill="none" stroke="#241F14" strokeWidth="1.2" />
              {/* Axis lines */}
              <line x1="50" y1="50" x2="50" y2="8" stroke="#241F14" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="50" y1="50" x2="90" y2="34" stroke="#241F14" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="50" y1="50" x2="76" y2="86" stroke="#241F14" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="50" y1="50" x2="24" y2="86" stroke="#241F14" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="50" y1="50" x2="10" y2="34" stroke="#241F14" strokeWidth="1" strokeDasharray="2,2" />
              {/* Data polygon */}
              <motion.polygon
                points="50,15 82,34 71,76 34,74 18,34"
                fill="rgba(245,196,0,0.3)"
                stroke="#F5C400"
                strokeWidth="1.8"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="origin-center"
              />
              {/* Text labels */}
              <text x="50" y="4" textAnchor="middle" fill="#B0AA9A" fontSize="6.5" fontWeight="bold">Press</text>
              <text x="94" y="36" textAnchor="start" fill="#B0AA9A" fontSize="6.5" fontWeight="bold">Squat</text>
              <text x="76" y="96" textAnchor="middle" fill="#B0AA9A" fontSize="6.5" fontWeight="bold">Deads</text>
              <text x="24" y="96" textAnchor="middle" fill="#B0AA9A" fontSize="6.5" fontWeight="bold">Pull</text>
              <text x="6" y="36" textAnchor="end" fill="#B0AA9A" fontSize="6.5" fontWeight="bold">Bench</text>
            </svg>
          </div>
        </div>

        {/* Workout Completion Donut Chart */}
        <div className="bg-app-card border border-white/[0.09] rounded-2xl p-4 flex flex-col justify-between h-[190px]">
          <h4 className="text-[12px] font-bold text-white tracking-wide">Workouts Compliance</h4>
          
          <div className="flex justify-center my-1.5">
            <div className="relative w-18 h-18">
              <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
                <circle cx="36" cy="36" r="30" fill="none" stroke="#241F14" strokeWidth="7" />
                <motion.circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="url(#donutGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="188"
                  initial={{ strokeDashoffset: 188 }}
                  animate={{ strokeDashoffset: 188 - (188 * 76) / 100 }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
                <defs>
                  <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#F5C400" />
                    <stop offset="100%" stop-color="#CA8A04" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[14px]">
                {completionPercentage}%
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-[9px] text-text-sec font-semibold">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />Completed</span>
              <span className="text-white">19</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-accent shrink-0" />Missed</span>
              <span className="text-white">6</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />Skipped</span>
              <span className="text-white">3</span>
            </div>
          </div>
        </div>

        {/* Calories Burned Bar Chart */}
        <div className="bg-app-card border border-white/[0.09] rounded-2xl p-4 flex flex-col justify-between h-[190px]">
          <h4 className="text-[12px] font-bold text-white tracking-wide">Calories Burned</h4>
          <span className="text-[10px] text-text-sec font-semibold block leading-none">Avg 420 kcal</span>
          
          {/* Bar charts drawing */}
          <div className="flex items-end gap-1.5 h-20 w-full px-1 my-2">
            {[55, 35, 70, 45, 90, 60, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                  className="w-full bg-gold-dark-gradient rounded-t-[3px]"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[8px] text-text-sec font-bold">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>
        </div>

        {/* Recovery Trend Line Chart */}
        <div className="bg-app-card border border-white/[0.09] rounded-2xl p-4 flex flex-col justify-between h-[156px]">
          <div className="flex justify-between items-start">
            <h4 className="text-[12px] font-bold text-white tracking-wide">Recovery Trend</h4>
            <span className="text-[9.5px] font-bold text-lime-accent block">Stable</span>
          </div>
          <div className="text-lg font-extrabold text-lime-accent leading-none">+ Good</div>
          
          <div className="h-12 w-full my-1.5">
            <svg width="100%" height="100%" viewBox="0 0 150 46" preserveAspectRatio="none" className="overflow-visible">
              <defs>
                <linearGradient id="recTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#A3E635" stopOpacity="0.25" />
                  <stop offset="100%" stop-color="#A3E635" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,30 L20,18 L40,24 L60,10 L80,16 L100,6 L120,14 L150,4 L150,46 L0,46 Z"
                fill="url(#recTrendGrad)"
              />
              <motion.polyline
                points="0,30 20,18 40,24 60,10 80,16 100,6 120,14 150,4"
                fill="none"
                stroke="#A3E635"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
          </div>
          <div className="flex justify-between text-[8px] text-text-sec font-bold">
            <span>Apr 22</span>
            <span>May 20</span>
          </div>
        </div>

        {/* Nutrition Compliance Concentric Rings */}
        <div className="bg-app-card border border-white/[0.09] rounded-2xl p-4 flex flex-col justify-between h-[156px]">
          <h4 className="text-[12px] font-bold text-white tracking-wide">Nutrition Macros</h4>
          
          <div className="flex justify-center my-1 relative shrink-0">
            <svg width="64" height="64" viewBox="0 0 72 72" className="-rotate-90">
              <circle cx="36" cy="36" r="31" fill="none" stroke="#241F14" strokeWidth="3" />
              <motion.circle
                cx="36"
                cy="36"
                r="31"
                fill="none"
                stroke="var(--green)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="195"
                initial={{ strokeDashoffset: 195 }}
                animate={{ strokeDashoffset: 195 - (195 * proteinPct) / 100 }}
                transition={{ duration: 0.8 }}
              />
              <circle cx="36" cy="36" r="24" fill="none" stroke="#241F14" strokeWidth="3" />
              <motion.circle
                cx="36"
                cy="36"
                r="24"
                fill="none"
                stroke="var(--purple)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="151"
                initial={{ strokeDashoffset: 151 }}
                animate={{ strokeDashoffset: 151 - (151 * calPct) / 100 }}
                transition={{ duration: 0.8, delay: 0.15 }}
              />
              <circle cx="36" cy="36" r="17" fill="none" stroke="#241F14" strokeWidth="3" />
              <motion.circle
                cx="36"
                cy="36"
                r="17"
                fill="none"
                stroke="var(--cyan)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="107"
                initial={{ strokeDashoffset: 107 }}
                animate={{ strokeDashoffset: 107 - (107 * waterPct) / 100 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </svg>
          </div>

          <div className="flex justify-around text-[7.5px] text-text-sec leading-tight text-center font-bold">
            <div><b className="text-[9.5px] text-lime-accent block">{proteinPct}%</b>Prot</div>
            <div><b className="text-[9.5px] text-gold block">{calPct}%</b>Kcal</div>
            <div><b className="text-[9.5px] text-cyan block">{waterPct}%</b>Water</div>
          </div>
        </div>

      </div>

      {/* Achievements unlocked */}
      <div className="flex justify-between items-center mb-2.5">
        <h3 className="text-sm font-extrabold tracking-wide text-white">Achievements</h3>
        <span className="text-[11px] font-bold text-gold">View All</span>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2 shrink-0 mb-4">
        
        {/* Badge 1 */}
        <div className="w-[84px] shrink-0 text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FFD60A] to-[#CA8A04] rounded-2xl flex flex-col items-center justify-center shadow-lg relative clip-polygon">
            <div className="absolute inset-0.5 bg-black/40 rounded-2xl backdrop-blur-[1px] flex flex-col items-center justify-center">
              <Award className="w-5 h-5 text-white" />
              <span className="text-[10px] font-extrabold text-white leading-none mt-1">100</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-text-sec mt-1.5 leading-tight">Workouts</span>
        </div>

        {/* Badge 2 */}
        <div className="w-[84px] shrink-0 text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FB923C] to-[#C2410C] rounded-2xl flex flex-col items-center justify-center shadow-lg relative">
            <div className="absolute inset-0.5 bg-black/40 rounded-2xl backdrop-blur-[1px] flex flex-col items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
              <span className="text-[10px] font-extrabold text-white leading-none mt-1">5KG</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-text-sec mt-1.5 leading-tight">Weight Lost</span>
        </div>

        {/* Badge 3 */}
        <div className="w-[84px] shrink-0 text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#F97316] to-[#B91C1C] rounded-2xl flex flex-col items-center justify-center shadow-lg relative">
            <div className="absolute inset-0.5 bg-black/40 rounded-2xl backdrop-blur-[1px] flex flex-col items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-[10px] font-extrabold text-white leading-none mt-1">30</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-text-sec mt-1.5 leading-tight">Day Streak</span>
        </div>

        {/* Badge 4 */}
        <div className="w-[84px] shrink-0 text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#CA8A04] to-[#78350F] rounded-2xl flex flex-col items-center justify-center shadow-lg relative">
            <div className="absolute inset-0.5 bg-black/40 rounded-2xl backdrop-blur-[1px] flex flex-col items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-[9px] font-extrabold text-white leading-none mt-1">NEW PR</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-text-sec mt-1.5 leading-tight">Bench 90kg</span>
        </div>

        {/* Badge 5 */}
        <div className="w-[84px] shrink-0 text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FBBF24] to-[#B45309] rounded-2xl flex flex-col items-center justify-center shadow-lg relative">
            <div className="absolute inset-0.5 bg-black/40 rounded-2xl backdrop-blur-[1px] flex flex-col items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-text-sec mt-1.5 leading-tight">Consistent</span>
        </div>

      </div>

      {/* AI Insights Card */}
      <div className="bg-app-card border border-white/[0.09] rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4.5 h-4.5 text-cyan stroke-[2]" />
          <span className="text-[14.5px] font-extrabold text-white">AI Insights</span>
        </div>
        <p className="text-[12px] text-text-sec leading-relaxed mb-3.5">
          Your workout consistency improved by 18% over the past 30 days. Lower back strain recovery is entering phase 3 (resolved). Increase lower body intensity next week to keep strength gains balanced.
        </p>
        <button
          onClick={() => setActiveTab("coach")}
          className="h-10 px-5 rounded-xl border border-white/[0.09] bg-white/[0.04] text-white font-extrabold text-[12px] cursor-pointer hover:bg-white/[0.06] active:scale-95 transition-all"
        >
          See Details in Chat
        </button>
      </div>

    </div>
  );
};
