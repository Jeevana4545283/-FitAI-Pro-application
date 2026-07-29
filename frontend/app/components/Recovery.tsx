import React, { useState, useEffect } from "react";
import { 
  Bell, ChevronRight, ChevronLeft, Home, Activity, Calendar, ShieldAlert, 
  Award, Play, Pause, Check, Clock, RefreshCw, Trash2, 
  Upload, Download, FileText, Heart, Compass, Flame, 
  Sparkles, Info, ArrowRight, Droplet, Moon, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import axios from "axios";

// Base API configuration
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/recovery",
  timeout: 3000
});

interface RecoveryProps {
  setActiveTab: (tab: string) => void;
}

export const Recovery: React.FC<RecoveryProps> = ({ setActiveTab }) => {
  const {
    profile,
    recoveryScore: contextRecoveryScore,
    waterToday,
    caloriesToday,
    proteinToday,
    workoutStreak,
    activityLogs,
  } = useAppState();

  // API State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Performance Metrics
  const hydrationVolume = waterToday || 1.8;
  const hydrationPct = Math.min(100, Math.round((hydrationVolume / 2.8) * 100));
  const workoutsLogged = activityLogs.filter((a) => a.type === "workout").length;
  
  // Real-time computed recovery score based on user performance
  const calcScore = Math.min(100, Math.max(50, 95 - (workoutsLogged * 8) + Math.round(hydrationPct * 0.1)));
  const recoveryScore = contextRecoveryScore || calcScore;
  
  const recoveryStatus = recoveryScore > 85 ? "Primed for Peak Output" : recoveryScore > 65 ? "Moderate Recovery" : "High Muscle Fatigue";
  const recoveryDesc = recoveryScore > 85 
    ? "CNS readiness is high. Your sleep & hydration metrics support full hypertrophic loading today."
    : "Active muscle repair in progress. Consider light mobility work or low-impact cardio.";

  const [sleep, setSleep] = useState("7h 45m");
  const [sleepStatus, setSleepStatus] = useState("Good");
  const [sleepHistory, setSleepHistory] = useState<number[]>([40, 70, 55, 85, 60, 75]);
  const [heartRate, setHeartRate] = useState(62);
  const [hrStatus, setHrStatus] = useState("Resting");
  const [stressScore, setStressScore] = useState(42);
  const [stressStatus, setStressStatus] = useState("Moderate");

  // Timeline & Muscle Map
  const [timeline, setTimeline] = useState<any[]>([]);
  const [bodyStatus, setBodyStatus] = useState<any>({
    chest: "var(--green)",
    shoulders: "var(--green)",
    back: "var(--green)",
    arms: "var(--amber)",
    quads: "var(--red)",
    hamstrings: "var(--amber)"
  });
  
  // Tabs and recommendations
  const [activeTab, setActiveTabLocal] = useState<"body" | "advice">("body");
  const [advice, setAdvice] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Circular gauge config
  const CIRC = 314;
  const [gaugeOffset, setGaugeOffset] = useState(CIRC);

  // Fetch health and recovery stats
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tlRes, bodyRes, advRes, repRes] = await Promise.all([
        api.get("/timeline"),
        api.get("/body-status"),
        api.get("/advice"),
        api.get("/reports")
      ]);

      setTimeline(tlRes.data);
      setBodyStatus(bodyRes.data);
      setAdvice(advRes.data);
      setReports(repRes.data);

      animateGauge(recoveryScore);
    } catch (err) {
      console.warn("Recovery API failed, operating in offline fallback:", err);
      setTimeline([
        { "day": "Today", "score": recoveryScore, "color": "var(--green)", "icon": "check" },
        { "day": "Tomorrow", "score": 85, "color": "var(--blue)", "icon": "star" },
        { "day": "2 Days", "score": 70, "color": "var(--blue)", "icon": "star" },
        { "day": "Full Recovery", "score": 100, "color": "var(--purple)", "icon": "star" }
      ]);
      setAdvice([
        { "id": "1", "title": "Light Stretching", "duration": "10 min" },
        { "id": "2", "title": "Foam Rolling", "duration": "8 min" },
        { "id": "3", "title": "Increase Protein", "duration": "120–150g" },
        { "id": "4", "title": "Sleep Early", "duration": "7–8 hrs" }
      ]);
      setReports([
        { "id": "rep-1", "name": "Blood Report", "date": "May 18, 2026", "summaryStatus": "AI Summary Ready", "type": "General Health" }
      ]);
      animateGauge(recoveryScore);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const animateGauge = (targetScore: number) => {
    let startTimestamp: number | null = null;
    const duration = 1100; // 1.1s

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = targetScore * easeProgress;

      setGaugeOffset(CIRC - (CIRC * currentVal) / 100);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  // Upload new medical report
  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const res = await api.post("/reports/upload", null, {
        params: { name: "Lab Report PDF" }
      });
      setReports((prev) => [res.data, ...prev]);
    } catch (err) {
      console.warn("Upload API failed, local fallback log:", err);
      // Fallback upload
      const mockRep = {
        id: `rep-${Math.random().toString(36).substr(2, 5)}`,
        name: "Urinalysis PDF",
        date: "Today",
        summaryStatus: "AI Summary Ready",
        type: "Report"
      };
      setReports((prev) => [mockRep, ...prev]);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete medical report
  const handleDeleteReport = async (id: string) => {
    // Optimistic deletion
    setReports((prev) => prev.filter((r) => r.id !== id));
    try {
      await api.delete(`/reports/${id}`);
    } catch (err) {
      console.warn("Delete API failed, local only deletion applied:", err);
    }
  };

  return (
    <div className="flex-grow flex flex-col min-h-0 overflow-y-auto no-scrollbar relative bg-black text-white px-5 pt-2 pb-24">
      
      {/* 1. Header Topbar */}
      <div className="flex justify-between items-center mt-2.5 mb-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab("home")}
            className="w-9 h-9 rounded-xl bg-app-card border border-white/[0.09] flex items-center justify-center text-text-sec hover:text-white cursor-pointer active:scale-95 transition-all"
            title="Back to Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[19px] font-extrabold text-white">Recovery & Health</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("home")}
            className="px-3 py-1.5 rounded-xl bg-app-card border border-white/[0.09] text-xs font-bold text-gold hover:text-white cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {loading ? (
        // Loading Skeleton
        <div className="flex-grow flex flex-col gap-4 animate-pulse">
          <div className="h-36 bg-app-card border border-white/5 rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-28 bg-app-card border border-white/5 rounded-2xl" />
            <div className="h-28 bg-app-card border border-white/5 rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          
          {/* 2. Hero Gauge Card */}
          <div className="relative rounded-[22px] overflow-hidden p-5 border border-gold/22 bg-gradient-to-br from-[#111] to-[#191919] flex items-center gap-4">
            <div className="shrink-0">
              <span className="text-[13.5px] font-extrabold text-[#FDE9A8] block mb-2.5">Recovery Score</span>
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="11" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#recGrad)" strokeWidth="11" strokeLinecap="round"
                    strokeDasharray={CIRC}
                    style={{ strokeDashoffset: gaugeOffset }}
                  />
                  <defs>
                    <linearGradient id="recGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="55%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[25px] font-extrabold text-white">{recoveryScore}%</span>
                  <span className="text-[11px] text-green-450 font-bold mt-0.5">Excellent</span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-[#BFEFDD] font-semibold block mb-0.5">Status</span>
              <span className="text-[15px] font-extrabold text-white block mb-1.5">{recoveryStatus}</span>
              <p className="text-[10.5px] text-[#D9CBA0] leading-relaxed">
                {recoveryDesc}
              </p>
            </div>

            {/* Breathing SVG robot */}
            <div className="w-13 h-[66px] shrink-0">
              <svg viewBox="0 0 80 100" fill="none" className="w-full h-full animate-[breathe_3.4s_ease-in-out_infinite]">
                <defs>
                  <linearGradient id="mgrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                </defs>
                <circle cx="40" cy="16" r="10" fill="url(#mgrad)" opacity="0.9" />
                <circle cx="40" cy="16" r="3.5" fill="#FFD60A" />
                <path d="M40 26v18" stroke="url(#mgrad)" strokeWidth="7" strokeLinecap="round" />
                <path d="M40 34c-10 0-20 6-24 16M40 34c10 0 20 6 24 16" stroke="url(#mgrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M16 50c-4 6-4 14 6 16M64 50c4 6 4 14-6 16" stroke="url(#mgrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M22 66c8 8 28 8 36 0" stroke="url(#mgrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>

          {/* 3. Health Grid Widgets */}
          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: Sleep */}
            <div className="bg-app-card border border-white/[0.05] rounded-[18px] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-sec mb-2">
                  <Moon className="w-[15px] h-[15px] text-gold" />
                  <span>Sleep</span>
                </div>
                <div className="text-[17px] font-extrabold text-white">{sleep}</div>
                <span className="text-[10.5px] text-green-450 font-bold block mt-0.5">{sleepStatus}</span>
              </div>
              {/* Mini Sleep Bar Graphs */}
              <div className="flex items-end gap-1 h-5 mt-3">
                {sleepHistory.map((val, idx) => (
                  <div key={idx} className="flex-1 bg-gold rounded-[2px] opacity-80" style={{ height: `${val}%` }} />
                ))}
              </div>
            </div>

            {/* Card 2: Heart Rate */}
            <div className="bg-app-card border border-white/[0.05] rounded-[18px] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-sec mb-2">
                  <Heart className="w-[15px] h-[15px] text-red-accent fill-red-accent/10" />
                  <span>Heart Rate</span>
                </div>
                <div className="text-[17px] font-extrabold text-white">{heartRate} bpm</div>
                <span className="text-[10.5px] text-text-sec font-bold block mt-0.5">{hrStatus}</span>
              </div>
              {/* ECG Beating wave */}
              <svg className="w-full h-5 mt-2" viewBox="0 0 140 20" preserveAspectRatio="none">
                <polyline points="0,10 15,10 20,2 25,16 30,10 45,10 55,10 60,4 65,15 70,10 85,10 95,10 100,3 105,16 110,10 125,10 135,10"
                  fill="none" stroke="var(--color-red-accent)" strokeWidth="1.6"
                />
              </svg>
            </div>

            {/* Card 3: Water */}
            <div className="bg-app-card border border-white/[0.05] rounded-[18px] p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-sec mb-2">
                <Droplet className="w-[15px] h-[15px] text-cyan-400" />
                <span>Water Intake</span>
              </div>
              <div className="text-[17px] font-extrabold text-white">{hydrationVolume} L</div>
              <span className="text-[10.5px] text-text-sec font-bold block mt-0.5">{hydrationPct}%</span>
              <div className="h-1.5 rounded-full bg-[#232C3F] mt-3.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-full transition-all duration-700" style={{ width: `${hydrationPct}%` }} />
              </div>
            </div>

            {/* Card 4: Stress */}
            <div className="bg-app-card border border-white/[0.05] rounded-[18px] p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-sec mb-2">
                <Activity className="w-[15px] h-[15px] text-amber-accent" />
                <span>Stress</span>
              </div>
              <div className="text-[17px] font-extrabold text-amber-accent">{stressStatus}</div>
              <span className="text-[10.5px] text-text-sec font-bold block mt-0.5">{stressScore}/100</span>
              <div className="h-1.5 rounded-full bg-[#232C3F] mt-3.5 overflow-hidden">
                <div className="h-full bg-amber-accent rounded-full transition-all duration-700" style={{ width: `${stressScore}%` }} />
              </div>
            </div>
          </div>

          {/* 4. Timeline Card */}
          <div className="bg-app-card border border-white/[0.09] rounded-2.5xl p-4">
            <div className="flex items-center gap-1.5 text-[14.5px] font-extrabold text-white mb-3.5">
              <span>Recovery Timeline</span>
              <Info className="w-3.5 h-3.5 text-text-sec" />
            </div>
            
            <div className="flex justify-between items-center relative py-1">
              {/* Linear Background Bar */}
              <div className="absolute top-[11.5px] left-5 right-5 h-[2px] bg-gradient-to-r from-green-500 via-cyan-400 to-gold z-0" />
              
              {timeline.map((step, idx) => (
                <div key={idx} className="flex-1 text-center relative z-10">
                  <div className={`w-6 h-6 rounded-full mx-auto mb-2 flex items-center justify-center border-3 border-app-bg`}
                    style={{ backgroundColor: step.color }}
                  >
                    {step.icon === "check" ? (
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    ) : (
                      <Star className="w-2.5 h-2.5 text-white fill-white" />
                    )}
                  </div>
                  <div className="text-[10.5px] text-text-sec font-bold">{step.day}</div>
                  <div className="text-[12.5px] font-extrabold mt-0.5" style={{ color: step.color }}>
                    {step.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Tabbed Body Status vs Advice Cards */}
          <div className="bg-app-card border border-white/[0.09] rounded-2.5xl p-4">
            {/* Tabs Selector */}
            <div className="flex bg-black/60 rounded-xl p-1 mb-4">
              <button
                onClick={() => setActiveTabLocal("body")}
                className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "body"
                    ? "bg-gradient-to-r from-gold to-gold-bright text-app-bg shadow"
                    : "text-text-sec hover:text-white"
                }`}
              >
                Body Status
              </button>
              <button
                onClick={() => setActiveTabLocal("advice")}
                className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "advice"
                    ? "bg-gradient-to-r from-gold to-gold-bright text-app-bg shadow"
                    : "text-text-sec hover:text-white"
                }`}
              >
                AI Recovery Advice
              </button>
            </div>

            {/* Panel 1: Body Status muscle outline */}
            {activeTab === "body" && (
              <div className="flex flex-col items-center py-1">
                <svg width="100" height="156" viewBox="0 0 90 140" className="drop-shadow-lg">
                  {/* Head */}
                  <ellipse cx="45" cy="12" rx="9" ry="10" fill="#3A4356" />
                  {/* Neck */}
                  <path d="M31 22 h28 v12 h-28 z" fill="#3A4356" />
                  {/* Chest */}
                  <path d="M22 34 h46 v16 a23 23 0 0 1 -46 0 z" fill={bodyStatus.chest} opacity="0.85" />
                  {/* Arms */}
                  <rect x="11" y="36" width="11" height="30" rx="5.5" fill={bodyStatus.arms} opacity="0.7" />
                  <rect x="68" y="36" width="11" height="30" rx="5.5" fill={bodyStatus.arms} opacity="0.75" />
                  {/* Abdomen */}
                  <rect x="26" y="52" width="38" height="34" rx="8" fill="#3A4356" />
                  {/* Legs */}
                  <rect x="28" y="88" width="15" height="32" rx="6" fill={bodyStatus.quads} opacity="0.8" />
                  <rect x="47" y="88" width="15" height="32" rx="6" fill={bodyStatus.hamstrings} opacity="0.75" />
                </svg>
                
                {/* Legend list */}
                <div className="flex gap-4 mt-4 text-[10.5px] text-text-sec font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>Recovered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-accent" />
                    <span>Recovering</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-accent" />
                    <span>High Fatigue</span>
                  </div>
                </div>

                <button className="w-full max-w-[220px] h-9 rounded-lg bg-gold hover:bg-gold-bright text-app-bg font-extrabold text-[11px] cursor-pointer mt-5 transition-all">
                  View Full Body Map
                </button>
              </div>
            )}

            {/* Panel 2: AI Recovery Advice Lists */}
            {activeTab === "advice" && (
              <div className="flex flex-col gap-3">
                {advice.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/[0.02] p-1.5 rounded-xl transition-all">
                    <div className="w-7.5 h-7.5 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 fill-gold/10" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <b className="text-[12.5px] font-extrabold text-white block">{item.title}</b>
                      <span className="text-[10px] text-text-sec font-bold mt-0.5">{item.duration}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-sec shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. Medical Reports */}
          <div className="bg-app-card border border-white/[0.09] rounded-2.5xl p-4">
            <div className="flex justify-between items-center mb-3.5">
              <span className="text-[14.5px] font-extrabold text-white">Medical Reports</span>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="text-[11.5px] text-gold font-extrabold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? "Uploading..." : "Upload New"}</span>
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              {reports.map((rep) => (
                <div key={rep.id} className="flex items-center gap-3 bg-black/30 border border-white/[0.03] rounded-2xl p-3.5 relative group">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <b className="text-[13px] font-extrabold text-white truncate block">{rep.name}</b>
                    <span className="text-[10.5px] text-text-sec font-bold block mt-0.5">{rep.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] font-extrabold bg-green-500/10 text-green-400 border border-green-500/25 px-2.5 py-1 rounded-full shrink-0">
                      {rep.summaryStatus}
                    </span>
                    <button
                      onClick={() => handleDeleteReport(rep.id)}
                      className="w-8 h-8 rounded-lg bg-red-accent/10 border border-red-accent/20 text-red-accent flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <div className="text-center py-6 text-text-sec text-xs font-bold flex flex-col items-center gap-2">
                  <FileText className="w-8 h-8 opacity-40" />
                  <span>No medical reports uploaded yet.</span>
                </div>
              )}
            </div>
          </div>

          {/* 7. Start Routine CTA Button */}
          <button
            onClick={() => alert("Launching physical recovery routine timer!")}
            className="w-full h-14 bg-gradient-to-r from-gold to-gold-amber text-app-bg font-extrabold text-sm cursor-pointer shadow-[0_10px_28px_-10px_rgba(245,196,0,0.6)] rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-all mb-20"
          >
            <span>Start Recovery Routine</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

        </div>
      )}

    </div>
  );
};
