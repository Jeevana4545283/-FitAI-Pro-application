import React, { useState, useEffect } from "react";
import { 
  Play, Pause, Check, Award, Sparkles, Flame, Clock, 
  RefreshCw, ChevronDown, ChevronUp, ChevronLeft, Home, User, Dumbbell, 
  Compass, CheckCircle, Search, Bell, Heart, Share2, 
  Download, ArrowRight, Zap, Trophy, MessageSquare, Activity,
  Info, ShieldAlert, FastForward, SkipForward, StopCircle,
  HelpCircle, Target, Layers, ArrowUpRight, X, ThumbsUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import { fetchWorkouts, generateAIWorkoutApi, finishWorkoutSessionApi, sendCoachMessageApi } from "../lib/workoutApi";

interface WorkoutProps {
  setActiveTab: (tab: string) => void;
}

export const Workout: React.FC<WorkoutProps> = ({ setActiveTab }) => {
  const {
    profile,
    workoutStreak,
    activeWorkout,
    finishWorkout,
  } = useAppState();
  const { user } = useAuth();

  // Retrieve full onboarding profile data if available
  let profileData: any = null;
  try {
    const stored = localStorage.getItem("fitaix_profile_data");
    if (stored) profileData = JSON.parse(stored);
  } catch (e) {}

  const activeName = profileData?.name || user?.name || (profile.name !== "Priyanshi Sharma" ? profile.name : "") || "Athlete";
  const firstName = activeName.split(" ")[0];

  // Dynamic Real-Time Date & Greeting
  const now = new Date();
  const hours = now.getHours();
  const timeGreeting = hours < 12 ? "Good Morning" : hours < 17 ? "Good Afternoon" : "Good Evening";
  const todayFormatted = now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  // View States: 'home' | 'details' | 'player' | 'completion'
  const [view, setView] = useState<"home" | "details" | "player" | "completion">("home");

  // Modals & Drawers
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<any>(null);
  const [showCoachChat, setShowCoachChat] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Search and Category Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Strength");

  // Player & Interactive Progress State
  const [playerIndex, setPlayerIndex] = useState(0);
  const [playerTimer, setPlayerTimer] = useState(0);
  const [playerActive, setPlayerActive] = useState(true);
  const [playerResting, setPlayerResting] = useState(false);
  const [playerRestTimer, setPlayerRestTimer] = useState(45);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [completedSetsMap, setCompletedSetsMap] = useState<Record<string, boolean[]>>({});

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { sender: 'ai', text: `Hi ${firstName}! I'm your FitAIX Coach. Ask me anything about form, muscle targeting, weights, or alternatives!` }
  ]);
  const [inputMsg, setInputMsg] = useState("");

  // Twinkling stars effect
  const [stars, setStars] = useState<Array<{ id: number; left: string; top: string; size: number; delay: string }>>([]);

  useEffect(() => {
    const generated = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 70}%`,
      size: Math.random() * 2.5 + 1.2,
      delay: `${Math.random() * 2}s`
    }));
    setStars(generated);
  }, []);

  // Live Timer for Active Workout
  useEffect(() => {
    let interval: any = null;
    if (view === "player" && playerActive && !playerResting) {
      interval = setInterval(() => {
        setPlayerTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, playerActive, playerResting]);

  // Rest Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (view === "player" && playerResting) {
      interval = setInterval(() => {
        setPlayerRestTimer((prev) => {
          if (prev <= 1) {
            setPlayerResting(false);
            return 45;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, playerResting]);

  // Main Default AI Generated Workout
  const defaultWorkout = {
    id: "wkt-push-hypertrophy",
    name: "Push Strength & Hypertrophy",
    description: "AI-customized upper body push session tailored for maximum muscle activation while protecting joints.",
    difficulty: "Intermediate",
    difficultyPct: 75,
    duration: profileData?.dailyAvailableTime ? parseInt(profileData.dailyAvailableTime) || 45 : 45,
    calories: 420,
    confidence: 96,
    equipment: profileData?.equipment?.length ? profileData.equipment : ["Dumbbells", "Barbell"],
    targetMuscles: ["Chest", "Shoulders", "Triceps"],
    exercises: [
      {
        id: "ex-bench-press",
        name: "Barbell Bench Press",
        sets: 4,
        reps: "8-10",
        weight: 80.0,
        restTime: 60,
        targetMuscle: "Chest",
        difficulty: "Intermediate",
        estimatedCalories: 110,
        equipmentNeeded: "Barbell & Bench",
        coachTips: "Keep shoulder blades retracted and drive firmly through heels.",
        instructions: [
          "Lie flat on bench with feet planted on ground.",
          "Grip barbell slightly wider than shoulder-width.",
          "Lower bar smoothly to mid-chest under control.",
          "Press bar up explosively while exhaling."
        ],
        commonMistakes: [
          "Bouncing barbell off chest",
          "Flaring elbows at 90-degree angle",
          "Lifting hips off the bench"
        ],
        variations: {
          beginner: "Dumbbell Chest Press on Flat Bench",
          advanced: "Pause Bench Press (2-sec pause at chest)"
        },
        alternatives: ["Incline Dumbbell Press", "Chest Dip", "Push-Ups"]
      },
      {
        id: "ex-incline-press",
        name: "Incline Dumbbell Press",
        sets: 3,
        reps: "10-12",
        weight: 32.0,
        restTime: 60,
        targetMuscle: "Upper Chest & Shoulders",
        difficulty: "Intermediate",
        estimatedCalories: 95,
        equipmentNeeded: "Dumbbells & Incline Bench",
        coachTips: "Control the eccentric phase down to upper chest level.",
        instructions: [
          "Set bench angle to 30-45 degrees.",
          "Press dumbbells straight up above shoulders.",
          "Lower weights slowly until thumbs line up with mid-chest.",
          "Squeeze upper chest at peak height."
        ],
        commonMistakes: [
          "Bench angle set too steep (>45 deg)",
          "Colliding dumbbells at top"
        ],
        variations: {
          beginner: "Incline Push-Ups on Smith Machine",
          advanced: "Incline Dumbbell Press with 3-sec negative"
        },
        alternatives: ["Incline Barbell Press", "Cable Upper Fly"]
      },
      {
        id: "ex-cable-fly",
        name: "Cable Chest Fly",
        sets: 3,
        reps: "12-15",
        weight: 18.0,
        restTime: 45,
        targetMuscle: "Chest Isolation",
        difficulty: "Beginner",
        estimatedCalories: 80,
        equipmentNeeded: "Cable Machine",
        coachTips: "Maintain a constant soft bend at elbows and hug an imaginary tree.",
        instructions: [
          "Set pulleys at chest level and step forward slightly.",
          "Bring handles together in front with slight elbow bend.",
          "Pause for 1 second at peak contraction.",
          "Return under full control feeling deep chest stretch."
        ],
        commonMistakes: [
          "Bending and extending arms like a press",
          "Using excessive body momentum"
        ],
        variations: {
          beginner: "Pec Deck Machine Fly",
          advanced: "Single-Arm Low-to-High Cable Fly"
        },
        alternatives: ["Dumbbell Fly", "Resistance Band Fly"]
      },
      {
        id: "ex-tricep-pushdown",
        name: "Rope Tricep Pushdown",
        sets: 3,
        reps: "12-15",
        weight: 24.0,
        restTime: 45,
        targetMuscle: "Triceps Lateral Head",
        difficulty: "Beginner",
        estimatedCalories: 75,
        equipmentNeeded: "Cable Machine & Rope",
        coachTips: "Lock elbows firmly to ribcage and spread rope handles at bottom.",
        instructions: [
          "Grip rope attachment with palms facing each other.",
          "Keep upper arms stationary next to torso.",
          "Push rope down extending elbows fully.",
          "Spread ends of rope outward at peak extension."
        ],
        commonMistakes: [
          "Allowing elbows to flare forward",
          "Hunching shoulders forward"
        ],
        variations: {
          beginner: "Straight Bar Pushdown",
          advanced: "Overhead Rope Tricep Extension"
        },
        alternatives: ["Skullcrushers", "Dumbbell Tricep Kickback"]
      }
    ]
  };

  const [currentWorkout, setCurrentWorkout] = useState<any>(defaultWorkout);

  // Initialize sets map
  useEffect(() => {
    const map: Record<string, boolean[]> = {};
    currentWorkout.exercises.forEach((ex: any) => {
      map[ex.id] = new Array(ex.sets).fill(false);
    });
    setCompletedSetsMap(map);
  }, [currentWorkout]);

  const handleStartWorkout = (wkt?: any) => {
    const targetWkt = wkt || currentWorkout;
    setCurrentWorkout(targetWkt);
    setPlayerIndex(0);
    setPlayerTimer(0);
    setPlayerActive(true);
    setPlayerResting(false);
    setView("player");
    toast.success("Workout Started! Stay Focused 🔥");
  };

  const handleToggleExerciseComplete = (exId: string) => {
    setCompletedExercises((prev) => {
      const exists = prev.includes(exId);
      if (exists) {
        return prev.filter((id) => id !== exId);
      } else {
        toast.success("Exercise Completed! +35 XP 🌟");
        return [...prev, exId];
      }
    });
  };

  const handleToggleSetComplete = (exId: string, setIdx: number) => {
    setCompletedSetsMap((prev) => {
      const currentSets = prev[exId] ? [...prev[exId]] : [false, false, false];
      currentSets[setIdx] = !currentSets[setIdx];

      // If all sets complete, mark exercise complete
      if (currentSets.every(Boolean)) {
        if (!completedExercises.includes(exId)) {
          setCompletedExercises((e) => [...e, exId]);
          toast.success("All sets completed for this exercise!");
        }
      }

      // Rest timer trigger
      if (currentSets[setIdx]) {
        setPlayerResting(true);
        setPlayerRestTimer(currentWorkout.exercises[playerIndex]?.restTime || 45);
      }

      return { ...prev, [exId]: currentSets };
    });
  };

  const handleNextExercise = () => {
    if (playerIndex < currentWorkout.exercises.length - 1) {
      setPlayerIndex((prev) => prev + 1);
      setPlayerResting(false);
    } else {
      handleFinishSession();
    }
  };

  const handleSkipExercise = () => {
    toast("Exercise Skipped", { icon: "⏭️" });
    handleNextExercise();
  };

  const handleReplaceExercise = () => {
    const currentEx = currentWorkout.exercises[playerIndex];
    const alt = currentEx?.alternatives?.[0] || "Dumbbell Press";

    const updatedExercises = [...currentWorkout.exercises];
    updatedExercises[playerIndex] = {
      ...currentEx,
      name: alt,
    };

    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises,
    });

    toast.success(`Replaced exercise with ${alt}!`);
  };

  const handleFinishSession = async () => {
    finishWorkout();
    try {
      await finishWorkoutSessionApi(
        currentWorkout.id || 'wkt-1',
        playerTimer || 2700,
        currentWorkout.calories || 420,
        100.0
      );
    } catch (e) {}
    setView("completion");
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#F5C400", "#FFD60A", "#FFFFFF"]
    });
  };

  const handleSendCoachMsg = async (customText?: string) => {
    const query = customText || inputMsg;
    if (!query.trim()) return;

    const userMsg = { sender: 'user' as const, text: query };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMsg("");

    try {
      const res = await sendCoachMessageApi(query, 'workout');
      if (res && res.text) {
        setChatMessages((prev) => [...prev, { sender: 'ai', text: res.text }]);
        return;
      }
    } catch (e) {}

    setTimeout(() => {
      let reply = "Focus on explosive execution during the concentric phase while maintaining strict 2-second control on the way down!";
      const q = query.toLowerCase();
      if (q.includes("form") || q.includes("how to")) {
        reply = "Keep your core tight, feet planted firmly on the ground, and maintain a natural arch in your lower back without flaring elbows.";
      } else if (q.includes("alternative") || q.includes("replace")) {
        reply = "You can replace this movement with Dumbbell Incline Press or Cable Flyes to reduce joint load!";
      } else if (q.includes("weight") || q.includes("heavy")) {
        reply = "Start with a weight where you can comfortably perform 8-10 clean reps with 2 reps remaining in reserve (RIR 2).";
      } else if (q.includes("muscle") || q.includes("target")) {
        reply = "This exercise primary targets the Pectoralis Major (Chest), with secondary activation in Anterior Deltoids & Triceps!";
      }
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  const categories = [
    { name: "Strength", icon: <Dumbbell className="w-4 h-4" /> },
    { name: "Cardio", icon: <Flame className="w-4 h-4" /> },
    { name: "HIIT", icon: <Zap className="w-4 h-4" /> },
    { name: "Mobility", icon: <Compass className="w-4 h-4" /> },
    { name: "Recovery", icon: <Heart className="w-4 h-4" /> }
  ];

  const totalExercises = currentWorkout.exercises.length;
  const completedCount = completedExercises.length;
  const progressPct = Math.round((completedCount / totalExercises) * 100);

  return (
    <div className="flex-grow flex flex-col min-h-0 overflow-y-auto no-scrollbar relative bg-black text-white px-5 pt-2 pb-24">
      <AnimatePresence mode="wait">
        
        {/* ==========================================
            VIEW 1: WORKOUT HOME
           ========================================== */}
        {view === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-grow flex flex-col gap-4"
          >
            {/* 1. HEADER */}
            <div className="flex justify-between items-center mt-2 mb-1">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveTab("home")}
                  className="w-9 h-9 rounded-xl bg-[#161616] border border-white/[0.09] flex items-center justify-center text-[#B0AA9A] hover:text-white cursor-pointer active:scale-95 transition-all"
                  title="Back to Dashboard"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <span className="text-[11px] text-[#B0AA9A] font-semibold block">{todayFormatted} · {timeGreeting}</span>
                  <h2 className="text-lg font-extrabold text-white mt-0.5">{firstName} 👋</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("home")}
                  className="px-3 py-1.5 rounded-xl bg-[#161616] border border-white/[0.09] text-xs font-bold text-gold hover:text-white cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
              </div>
            </div>

            {/* Profile Injury / Safety Warning Alert Banner */}
            {profileData?.hasPastInjuries && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 flex items-center gap-3 text-xs text-red-300">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-extrabold block text-white">Injury Protection Active</span>
                  <span className="text-[11px] text-red-300/80 truncate block">
                    Modifying routine for: {profileData.injuryDetails || "Joint Sensitivity"}
                  </span>
                </div>
              </div>
            )}

            {/* Search & Category Filter */}
            <div className="flex flex-col gap-3">
              <div className="h-11 bg-[#161616] border border-white/[0.09] rounded-2xl flex items-center px-4 gap-3 focus-within:border-gold/40 transition-all">
                <Search className="w-4 h-4 text-[#B0AA9A]" />
                <input
                  type="text"
                  placeholder="Search exercise database..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-xs flex-1 placeholder:text-[#B0AA9A]"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold cursor-pointer border transition-all whitespace-nowrap ${
                      activeCategory === cat.name
                        ? "bg-gold text-black border-gold shadow-md shadow-gold/20"
                        : "bg-[#161616] border-white/[0.05] text-[#B0AA9A] hover:text-white"
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. TODAY'S BEST WORKOUT CARD */}
            <div className="relative rounded-[28px] overflow-hidden p-5 border border-gold/20 shadow-[0_20px_45px_-18px_rgba(245,196,0,0.35)] bg-gradient-to-br from-[#1c1c1c] via-[#131313] to-[#0a0a0a]">
              
              {/* Twinkling Stars Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {stars.map((star) => (
                  <div
                    key={star.id}
                    className="absolute bg-[#FFE9A8] rounded-full animate-pulse"
                    style={{
                      left: star.left,
                      top: star.top,
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      animationDuration: "2.6s",
                      animationDelay: star.delay,
                      opacity: 0.7
                    }}
                  />
                ))}
              </div>

              {/* Card Header & AI Confidence Badge */}
              <div className="flex justify-between items-start relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-black bg-gold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 fill-black" />
                      Today's Best Workout
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-gold bg-gold/15 border border-gold/30 px-2 py-0.5 rounded-full">
                      AI Confidence: {currentWorkout.confidence}%
                    </span>
                  </div>

                  <h3 className="text-[23px] font-extrabold text-white leading-tight mt-1">
                    {currentWorkout.name}
                  </h3>

                  {/* Target Muscle Icons */}
                  <div className="flex items-center gap-2 mt-2">
                    <Target className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs font-bold text-white/80">
                      {currentWorkout.targetMuscles.join(" • ")}
                    </span>
                  </div>
                </div>

                {/* Animated Robot SVG */}
                <div className="w-24 h-24 mt-[-4px] animate-[bounce_3.4s_ease-in-out_infinite] shrink-0">
                  <svg viewBox="0 0 150 150" fill="none" className="w-full h-full drop-shadow-[0_14px_20px_rgba(0,0,0,0.35)]">
                    <defs>
                      <linearGradient id="botBody" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFF8E8" />
                        <stop offset="100%" stopColor="#E8D9A0" />
                      </linearGradient>
                      <radialGradient id="eyeglow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFE9A8" />
                        <stop offset="100%" stopColor="#F5C400" />
                      </radialGradient>
                    </defs>
                    <ellipse cx="75" cy="128" rx="30" ry="6" fill="#000" opacity=".25" />
                    <rect x="45" y="60" width="60" height="58" rx="22" fill="url(#botBody)" />
                    <circle cx="75" cy="34" r="26" fill="url(#botBody)" />
                    <rect x="66" y="6" width="18" height="10" rx="5" fill="#FFD60A" />
                    <circle cx="75" cy="4" r="4" fill="#FFD60A" />
                    <ellipse cx="65" cy="34" rx="6" ry="7" fill="url(#eyeglow)" />
                    <ellipse cx="85" cy="34" rx="6" ry="7" fill="url(#eyeglow)" />
                    <path d="M64 46q11 7 22 0" stroke="#B0A488" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                    <rect x="58" y="72" width="34" height="6" rx="3" fill="#F5C400" opacity=".55" />
                    <rect x="20" y="66" width="16" height="30" rx="8" fill="url(#botBody)" />
                    <rect x="10" y="58" width="14" height="16" rx="7" fill="url(#botBody)" transform="rotate(-25 17 66)" />
                    <rect x="114" y="66" width="16" height="30" rx="8" fill="url(#botBody)" />
                    <rect x="50" y="118" width="16" height="24" rx="7" fill="url(#botBody)" />
                    <rect x="84" y="118" width="16" height="24" rx="7" fill="url(#botBody)" />
                  </svg>
                </div>
              </div>

              {/* Progress Bars & Meta Metrics */}
              <div className="flex flex-col gap-2.5 mt-4 mb-4 relative z-10">
                {/* Difficulty Progress Bar */}
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between font-bold text-white/80">
                    <span>Difficulty Level</span>
                    <span className="text-gold font-extrabold">{currentWorkout.difficulty} ({currentWorkout.difficultyPct}%)</span>
                  </div>
                  <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-gold rounded-full"
                      style={{ width: `${currentWorkout.difficultyPct}%` }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 pt-1 font-bold text-xs text-white/90">
                  <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5">
                    <Clock className="w-4 h-4 text-gold" />
                    <span>{currentWorkout.duration} Mins</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5">
                    <Layers className="w-4 h-4 text-gold" />
                    <span>{currentWorkout.exercises.length} Exercises</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>{currentWorkout.calories} Kcal</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 relative z-10">
                <button
                  onClick={() => handleStartWorkout()}
                  className="flex-1 h-12 bg-gold hover:bg-gold-bright text-black font-extrabold text-xs cursor-pointer shadow-lg shadow-gold/20 rounded-2xl flex items-center justify-center gap-2 active:scale-97 transition-all uppercase tracking-wider"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Workout</span>
                </button>
                <button
                  onClick={() => setShowCustomizer(true)}
                  className="flex-1 h-12 bg-white/5 border border-white/20 hover:bg-white/10 text-white font-extrabold text-xs cursor-pointer rounded-2xl flex items-center justify-center gap-2 active:scale-97 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Customize</span>
                </button>
              </div>
            </div>

            {/* 3. AI RECOMMENDATION CARD */}
            <div className="bg-[#161616] border border-white/[0.09] rounded-3xl p-4.5 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Body & Recovery Metrics</span>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
                  Updated Live
                </span>
              </div>

              {/* 6 Grid Scores */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col items-center bg-black/40 border border-white/5 rounded-2xl p-2.5 text-center">
                  <span className="text-[10px] text-[#B0AA9A] font-bold">Recovery</span>
                  <span className="text-sm font-extrabold text-green-400 mt-0.5">92%</span>
                </div>
                <div className="flex flex-col items-center bg-black/40 border border-white/5 rounded-2xl p-2.5 text-center">
                  <span className="text-[10px] text-[#B0AA9A] font-bold">Sleep Score</span>
                  <span className="text-sm font-extrabold text-gold mt-0.5">88%</span>
                </div>
                <div className="flex flex-col items-center bg-black/40 border border-white/5 rounded-2xl p-2.5 text-center">
                  <span className="text-[10px] text-[#B0AA9A] font-bold">Readiness</span>
                  <span className="text-sm font-extrabold text-cyan-400 mt-0.5">High</span>
                </div>
                <div className="flex flex-col items-center bg-black/40 border border-white/5 rounded-2xl p-2.5 text-center">
                  <span className="text-[10px] text-[#B0AA9A] font-bold">Stress Level</span>
                  <span className="text-sm font-extrabold text-green-400 mt-0.5">Low (18)</span>
                </div>
                <div className="flex flex-col items-center bg-black/40 border border-white/5 rounded-2xl p-2.5 text-center">
                  <span className="text-[10px] text-[#B0AA9A] font-bold">Hydration</span>
                  <span className="text-sm font-extrabold text-cyan-400 mt-0.5">Optimal</span>
                </div>
                <div className="flex flex-col items-center bg-black/40 border border-white/5 rounded-2xl p-2.5 text-center">
                  <span className="text-[10px] text-[#B0AA9A] font-bold">Motivation</span>
                  <span className="text-sm font-extrabold text-amber-400 mt-0.5">Peak (95%)</span>
                </div>
              </div>

              {/* Why this workout button */}
              <button
                onClick={() => setShowWhyModal(true)}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-98"
              >
                <HelpCircle className="w-4 h-4 text-gold" />
                <span>Why this workout?</span>
              </button>
            </div>

            {/* 6. WORKOUT PROGRESS HEADER */}
            <div className="flex justify-between items-center mt-2">
              <div>
                <h3 className="text-base font-extrabold text-white">Today's Exercises</h3>
                <span className="text-xs text-[#B0AA9A] font-bold">
                  Progress: {completedCount}/{totalExercises} Exercises Completed
                </span>
              </div>

              {/* Circular Progress Ring */}
              <div className="w-10 h-10 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="20" cy="20" r="16" stroke="#241F14" strokeWidth="4" fill="transparent" />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="#F5C400"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={2 * Math.PI * 16 - (progressPct / 100) * 2 * Math.PI * 16}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[10px] font-extrabold text-white">{progressPct}%</span>
              </div>
            </div>

            {/* 4. TODAY'S EXERCISES CARDS */}
            <div className="flex flex-col gap-3">
              {currentWorkout.exercises.map((ex: any, idx: number) => {
                const isCompleted = completedExercises.includes(ex.id);
                return (
                  <div
                    key={ex.id}
                    className={`bg-[#161616] border rounded-2xl p-4 flex flex-col gap-3 transition-all ${
                      isCompleted ? "border-green-500/40 bg-green-500/5" : "border-white/[0.09]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-extrabold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-white">{ex.name}</h4>
                          <span className="text-xs text-[#B0AA9A] font-bold block mt-0.5">
                            Target: {ex.targetMuscle}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedExerciseModal(ex)}
                        className="text-[#B0AA9A] hover:text-white p-1"
                      >
                        <Info className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    {/* Exercise Details Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl text-center text-xs font-bold text-white/90">
                      <div>
                        <span className="text-[9.5px] text-[#B0AA9A] block">Sets × Reps</span>
                        <span>{ex.sets} × {ex.reps}</span>
                      </div>
                      <div>
                        <span className="text-[9.5px] text-[#B0AA9A] block">Rest Time</span>
                        <span>{ex.restTime}s</span>
                      </div>
                      <div>
                        <span className="text-[9.5px] text-[#B0AA9A] block">Est. Calories</span>
                        <span>{ex.estimatedCalories} kcal</span>
                      </div>
                    </div>

                    {/* Action Bar: Start, Details, Mark Complete */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleStartWorkout()}
                        className="flex-1 bg-gold text-black font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-gold/90 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start</span>
                      </button>

                      <button
                        onClick={() => setSelectedExerciseModal(ex)}
                        className="flex-1 bg-white/5 border border-white/10 text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-white/10 transition"
                      >
                        <Info className="w-3.5 h-3.5 text-gold" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => handleToggleExerciseComplete(ex.id)}
                        className={`flex-1 font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition ${
                          isCompleted
                            ? "bg-green-500 text-black shadow-md shadow-green-500/20"
                            : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isCompleted ? "Completed" : "Complete"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 11. GAMIFICATION BADGES */}
            <div className="bg-[#161616] border border-white/[0.09] rounded-3xl p-4 flex flex-col gap-3 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-gold" /> Workout Level & Achievements
                </span>
                <span className="text-xs font-mono font-bold text-green-400">+150 XP Available</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">
                    🥇
                  </div>
                  <div>
                    <span className="font-extrabold text-white block">Chest Specialist</span>
                    <span className="text-[10px] text-[#B0AA9A]">12/15 Sessions Done</span>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    🔥
                  </div>
                  <div>
                    <span className="font-extrabold text-white block">Streak Master</span>
                    <span className="text-[10px] text-[#B0AA9A]">12 Days Continuous</span>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* ==========================================
            VIEW 2: LIVE WORKOUT PLAYER & QUICK ACTIONS
           ========================================== */}
        {view === "player" && (
          <motion.div
            key="player"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-grow flex flex-col justify-between min-h-0 relative z-30"
          >
            {/* Header & Progress Indicator */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-gold font-extrabold uppercase tracking-widest block">Session Live</span>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  Exercise {playerIndex + 1} of {currentWorkout.exercises.length}
                </h3>
              </div>

              <button
                onClick={() => setView("home")}
                className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full text-xs font-bold text-red-400"
              >
                Quit Workout
              </button>
            </div>

            {/* Rest Phase vs Active Exercise Player */}
            {playerResting ? (
              <div className="my-auto flex flex-col items-center text-center gap-4 py-8">
                <span className="text-xs text-gold font-extrabold uppercase tracking-widest">Rest Period</span>
                <div className="w-36 h-36 rounded-full border-4 border-gold/30 flex flex-col items-center justify-center relative animate-pulse bg-gold/5 shadow-2xl shadow-gold/20">
                  <span className="text-4xl font-extrabold text-gold">{playerRestTimer}</span>
                  <span className="text-[10px] text-[#B0AA9A] font-bold uppercase mt-1">Seconds</span>
                </div>
                <p className="text-xs text-white/80 max-w-[260px]">
                  Next Exercise: <br />
                  <strong className="text-white text-sm">{currentWorkout.exercises[playerIndex]?.name}</strong>
                </p>
                <button
                  onClick={() => setPlayerResting(false)}
                  className="px-5 py-2.5 bg-gold text-black rounded-2xl text-xs font-extrabold uppercase tracking-wider"
                >
                  Skip Rest Now
                </button>
              </div>
            ) : (
              <div className="my-auto flex flex-col items-center gap-5 py-4">
                {/* Exercise Animation Icon */}
                <div className="w-28 h-28 rounded-3xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shadow-xl shadow-gold/10">
                  <Dumbbell className="w-12 h-12 animate-bounce" />
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-extrabold text-white">
                    {currentWorkout.exercises[playerIndex]?.name}
                  </h2>
                  <span className="text-xs text-[#B0AA9A] font-semibold mt-1 block">
                    Target: {currentWorkout.exercises[playerIndex]?.targetMuscle}
                  </span>
                </div>

                {/* Sets Checklist */}
                <div className="w-full max-w-[300px] flex flex-col gap-2">
                  <span className="text-[10px] text-gold font-extrabold uppercase tracking-wider text-center block">
                    Tap completed set:
                  </span>
                  {Array.from({ length: currentWorkout.exercises[playerIndex]?.sets || 3 }).map((_, sIdx) => {
                    const exId = currentWorkout.exercises[playerIndex]?.id;
                    const isDone = completedSetsMap[exId]?.[sIdx] || false;
                    return (
                      <button
                        key={sIdx}
                        onClick={() => handleToggleSetComplete(exId, sIdx)}
                        className={`h-11 rounded-2xl px-4 flex justify-between items-center border transition-all cursor-pointer font-bold text-xs ${
                          isDone
                            ? "bg-green-500/20 border-green-500/40 text-green-400"
                            : "bg-[#161616] border-white/10 text-white hover:border-white/20"
                        }`}
                      >
                        <span>Set {sIdx + 1}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#B0AA9A]">
                            {currentWorkout.exercises[playerIndex]?.reps} Reps @ {currentWorkout.exercises[playerIndex]?.weight}kg
                          </span>
                          {isDone ? <CheckCircle className="w-4 h-4 text-green-400" /> : <div className="w-4 h-4 rounded-full border-2 border-white/30" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 10. QUICK ACTIONS BAR */}
            <div className="flex flex-col gap-3 border-t border-white/10 pt-3">
              {/* Stats ticker */}
              <div className="flex justify-around text-center text-xs font-bold text-[#B0AA9A]">
                <div>
                  <span className="text-white text-sm block">
                    {Math.floor(playerTimer / 60)}:{(playerTimer % 60).toString().padStart(2, "0")}
                  </span>
                  <span>Duration</span>
                </div>
                <div>
                  <span className="text-white text-sm block">138 bpm</span>
                  <span>Heart Rate</span>
                </div>
                <div>
                  <span className="text-white text-sm block">
                    {Math.floor((playerTimer / 60) * 8.5)} kcal
                  </span>
                  <span>Est. Burn</span>
                </div>
              </div>

              {/* Quick Actions Row: Skip, Replace, Pause, Finish Early */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setPlayerActive(!playerActive)}
                  className="bg-white/5 border border-white/10 text-white font-extrabold py-2.5 rounded-xl text-[11px] flex flex-col items-center justify-center gap-1"
                >
                  {playerActive ? <Pause className="w-4 h-4 text-gold" /> : <Play className="w-4 h-4 text-gold" />}
                  <span>{playerActive ? "Pause" : "Resume"}</span>
                </button>

                <button
                  onClick={handleSkipExercise}
                  className="bg-white/5 border border-white/10 text-white font-extrabold py-2.5 rounded-xl text-[11px] flex flex-col items-center justify-center gap-1"
                >
                  <SkipForward className="w-4 h-4 text-gold" />
                  <span>Skip</span>
                </button>

                <button
                  onClick={handleReplaceExercise}
                  className="bg-white/5 border border-white/10 text-white font-extrabold py-2.5 rounded-xl text-[11px] flex flex-col items-center justify-center gap-1"
                >
                  <RefreshCw className="w-4 h-4 text-gold" />
                  <span>Replace</span>
                </button>

                <button
                  onClick={handleFinishSession}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 font-extrabold py-2.5 rounded-xl text-[11px] flex flex-col items-center justify-center gap-1"
                >
                  <StopCircle className="w-4 h-4 text-red-400" />
                  <span>Finish Early</span>
                </button>
              </div>

              <button
                onClick={handleNextExercise}
                className="w-full h-12 bg-gold text-black font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold/20 uppercase tracking-wider"
              >
                <span>{playerIndex < currentWorkout.exercises.length - 1 ? "Next Exercise" : "Finish Workout"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ==========================================
            VIEW 3: WORKOUT SUMMARY SCREEN
           ========================================== */}
        {view === "completion" && (
          <motion.div
            key="completion"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-grow flex flex-col justify-between py-6 relative z-30"
          >
            <div className="flex flex-col items-center text-center gap-4 mt-6">
              <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shadow-xl shadow-gold/10">
                <Trophy className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <span className="text-xs text-gold font-extrabold uppercase tracking-widest block">🎉 Session Accomplished</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Workout Complete!</h2>
                <p className="text-xs text-[#B0AA9A] mt-1 max-w-[240px] mx-auto">
                  Phenomenal execution, {firstName}. Your AI recovery countdown has begun.
                </p>
              </div>
            </div>

            {/* Metrics Breakdown Card */}
            <div className="bg-[#161616] border border-white/[0.09] rounded-3xl p-5 my-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex flex-col">
                  <span className="text-[10px] text-[#B0AA9A] font-bold">Total Burn</span>
                  <span className="text-lg font-extrabold text-white mt-0.5">380 kcal</span>
                </div>
                <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex flex-col">
                  <span className="text-[10px] text-[#B0AA9A] font-bold">Duration</span>
                  <span className="text-lg font-extrabold text-white mt-0.5">
                    {Math.floor(playerTimer / 60) || 42} Mins
                  </span>
                </div>
                <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex flex-col">
                  <span className="text-[10px] text-[#B0AA9A] font-bold">Exercises Completed</span>
                  <span className="text-lg font-extrabold text-white mt-0.5">
                    {totalExercises} / {totalExercises}
                  </span>
                </div>
                <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex flex-col">
                  <span className="text-[10px] text-[#B0AA9A] font-bold">Personal Record</span>
                  <span className="text-sm font-extrabold text-gold mt-0.5">🏆 Bench Press 80kg</span>
                </div>
              </div>

              <div className="bg-gold/10 border border-gold/20 p-3 rounded-2xl flex items-center justify-between text-xs text-gold">
                <span className="font-bold">Recommended Recovery Time:</span>
                <span className="font-extrabold">24 Hours</span>
              </div>
            </div>

            {/* Share & Done */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => toast.success("Achievement Shared to Community Feed!")}
                className="w-full h-11 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-4 h-4 text-gold" />
                <span>Share Achievement</span>
              </button>

              <button
                onClick={() => setView("home")}
                className="w-full h-12 bg-gold hover:bg-gold-bright text-black font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold/20 uppercase tracking-wider"
              >
                <span>Back to Workout Home</span>
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ==========================================
          MODAL 1: WHY THIS WORKOUT AI EXPLANATION
         ========================================== */}
      <AnimatePresence>
        {showWhyModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#161616] border border-white/10 rounded-3xl p-5 max-w-sm w-full text-white flex flex-col gap-4 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-sm font-extrabold text-gold uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Why AI Selected Today's Plan
                </h3>
                <button onClick={() => setShowWhyModal(false)} className="text-[#B0AA9A] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs text-[#B0AA9A] leading-relaxed">
                <p>
                  Based on your <strong className="text-white">92% Recovery Score</strong> and <strong className="text-white">7h 45m sleep</strong>, your central nervous system is fully primed for high-intensity hypertrophic loading.
                </p>
                <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex flex-col gap-1 text-white">
                  <span className="text-gold font-bold">Key Personalization Factors:</span>
                  <span>• Fitness Goal: {profileData?.fitnessGoal || "Muscle Gain"}</span>
                  <span>• Available Gear: {profileData?.equipment?.join(", ") || "Gym Barbell & Dumbbells"}</span>
                  <span>• Experience Level: {profileData?.experienceLevel || "Intermediate"}</span>
                </div>
              </div>

              <button
                onClick={() => setShowWhyModal(false)}
                className="w-full bg-gold text-black font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider"
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          MODAL 2: EXERCISE DETAILS SCREEN MODAL
         ========================================== */}
      <AnimatePresence>
        {selectedExerciseModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#161616] border border-white/10 rounded-3xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto text-white flex flex-col gap-4 shadow-2xl no-scrollbar"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] text-gold font-extrabold uppercase tracking-widest block">Exercise Guide</span>
                  <h3 className="text-base font-extrabold text-white">{selectedExerciseModal.name}</h3>
                </div>
                <button onClick={() => setSelectedExerciseModal(null)} className="text-[#B0AA9A] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Graphic Placeholder */}
              <div className="w-full h-36 bg-gradient-to-tr from-gold/15 to-amber-500/5 border border-gold/30 rounded-2xl flex items-center justify-center text-gold">
                <Dumbbell className="w-12 h-12 animate-pulse" />
              </div>

              {/* Step-by-Step Instructions */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-extrabold text-gold uppercase tracking-wider">Step-by-Step Instructions</span>
                <ul className="flex flex-col gap-1.5 text-xs text-white/90">
                  {selectedExerciseModal.instructions?.map((inst: string, i: number) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="w-4 h-4 rounded-full bg-gold/20 text-gold text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Mistakes */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 text-xs flex flex-col gap-1.5">
                <span className="font-extrabold text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Common Mistakes to Avoid
                </span>
                {selectedExerciseModal.commonMistakes?.map((m: string, idx: number) => (
                  <span key={idx} className="text-red-300/90 text-[11px] block">• {m}</span>
                ))}
              </div>

              {/* Variations */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#B0AA9A] block font-bold">Beginner Variation</span>
                  <span className="font-bold text-white text-[11px] mt-0.5 block">{selectedExerciseModal.variations?.beginner}</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gold block font-bold">Advanced Variation</span>
                  <span className="font-bold text-white text-[11px] mt-0.5 block">{selectedExerciseModal.variations?.advanced}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedExerciseModal(null)}
                className="w-full bg-gold text-black font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider mt-2"
              >
                Close Guide
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          8. FLOATING AI COACH CHAT WIDGET
         ========================================== */}
      <div className="fixed bottom-20 right-5 z-40">
        <button
          onClick={() => setShowCoachChat(!showCoachChat)}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-gold to-amber-400 text-black font-extrabold shadow-xl shadow-gold/30 flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer border border-white/20"
        >
          <MessageSquare className="w-6 h-6 fill-black" />
        </button>
      </div>

      <AnimatePresence>
        {showCoachChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-36 right-5 w-80 bg-[#161616] border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col text-white max-h-[420px]"
          >
            {/* Header */}
            <div className="bg-black/60 p-3.5 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-xs font-extrabold">FitAIX Coach Assistant</span>
              </div>
              <button onClick={() => setShowCoachChat(false)} className="text-[#B0AA9A] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-2.5 text-xs no-scrollbar">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl max-w-[85%] font-medium leading-relaxed ${
                    m.sender === 'ai'
                      ? "bg-black/50 border border-white/10 text-white self-start"
                      : "bg-gold text-black font-bold self-end"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="p-2 border-t border-white/5 bg-black/30 flex gap-1.5 overflow-x-auto no-scrollbar">
              {["How to perform?", "Suggest alternatives", "Explain muscle groups"].map((p) => (
                <button
                  key={p}
                  onClick={() => handleSendCoachMsg(p)}
                  className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#B0AA9A] hover:text-white whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-2.5 bg-black/60 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask coach..."
                className="flex-1 bg-[#101010] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-gold"
                onKeyDown={(e) => e.key === 'Enter' && handleSendCoachMsg()}
              />
              <button
                onClick={() => handleSendCoachMsg()}
                className="bg-gold text-black font-extrabold px-3 py-2 rounded-xl text-xs"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CUSTOMIZER MODAL */}
      <AnimatePresence>
        {showCustomizer && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#161616] border border-white/10 rounded-3xl p-5 max-w-sm w-full text-white flex flex-col gap-4 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-xs font-extrabold text-gold uppercase tracking-wider">Customize Workout Session</h3>
                <button onClick={() => setShowCustomizer(false)} className="text-[#B0AA9A] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs text-[#B0AA9A]">
                <label className="font-bold text-white">Target Goal</label>
                <select
                  value={currentWorkout.name}
                  onChange={(e) => {
                    toast.success(`Workout updated to ${e.target.value}`);
                    setShowCustomizer(false);
                  }}
                  className="bg-[#101010] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-gold outline-none"
                >
                  <option value="Push Strength & Hypertrophy">Push Strength & Hypertrophy</option>
                  <option value="Pull & Biceps Overload">Pull & Biceps Overload</option>
                  <option value="Legs & Core Power">Legs & Core Power</option>
                </select>
              </div>

              <button
                onClick={() => setShowCustomizer(false)}
                className="w-full bg-gold text-black font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider"
              >
                Apply Customizations
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
