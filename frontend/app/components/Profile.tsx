"use client";

import React, { useState } from "react";
import { User, ShieldAlert, Award, Watch, CreditCard, Download, LogOut, ChevronRight, ToggleLeft, ToggleRight, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { useAuth } from "../context/AuthContext";

interface ProfileProps {
  setActiveTab: (tab: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ setActiveTab }) => {
  const {
    profile,
    goals,
    equipment,
    updateProfile,
    toggleGoal,
    toggleEquipment,
    resetAppState,
  } = useAppState();
  const { user, logout } = useAuth();

  let loggedInUser = user;
  let storedProfileData: any = null;
  try {
    const storedUserRaw = localStorage.getItem("fitaix_user");
    if (storedUserRaw) loggedInUser = JSON.parse(storedUserRaw);
    const storedProfRaw = localStorage.getItem("fitaix_profile_data");
    if (storedProfRaw) storedProfileData = JSON.parse(storedProfRaw);
  } catch (e) {}

  const activeName = storedProfileData?.name || loggedInUser?.name || (profile.name !== "Priyanshi Sharma" ? profile.name : "") || "Athlete";
  const activeEmail = loggedInUser?.email || profile.email || "athlete@fitaix.com";

  const [activeTheme, setActiveTheme] = useState("dark");
  const [switches, setSwitches] = useState<Record<string, boolean>>({
    adaptive: true,
    voice: false,
    aggressive: false,
    workoutRem: true,
    recoveryAlert: true,
    socialUpd: false,
    public: true,
    shareData: true,
    twoFactor: true,
  });

  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState(activeName);
  const [tempEmail, setTempEmail] = useState(activeEmail);

  // Edit metric states
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [heightVal, setHeightVal] = useState(profile.height);
  const [weightVal, setWeightVal] = useState(profile.weight);
  const [ageVal, setAgeVal] = useState(profile.age);

  // Device states
  const [devices, setDevices] = useState<Record<string, string>>({
    apple: "connected",
    whoop: "connect",
    google: "connect",
  });

  // Export state
  const [exportStatus, setExportStatus] = useState<"idle" | "preparing" | "ready">("idle");

  // Logout state
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const toggleSwitch = (key: string) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = () => {
    updateProfile({ name: tempName, email: tempEmail });
    setEditMode(false);
  };

  const handleSaveMetrics = () => {
    updateProfile({ height: heightVal, weight: weightVal, age: ageVal });
    setIsEditingMetrics(false);
  };

  const handleConnectDevice = (dev: string) => {
    if (devices[dev] === "connected") return;
    setDevices((prev) => ({ ...prev, [dev]: "connecting" }));
    setTimeout(() => {
      setDevices((prev) => ({ ...prev, [dev]: "connected" }));
    }, 1200);
  };

  const handleExport = () => {
    setExportStatus("preparing");
    setTimeout(() => {
      setExportStatus("ready");
      setTimeout(() => {
        // Trigger file download mock
        const element = document.createElement("a");
        const file = new Blob([`FitAI Pro Export Data for ${activeName}
Streak: 24 days
Weight: ${profile.weight} kg
Height: ${profile.height} cm
`], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "fitai-pro-data.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setExportStatus("idle");
      }, 1000);
    }, 1000);
  };

  const handleLogout = async () => {
    resetAppState();
    await logout();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-app-bg text-white overflow-y-auto no-scrollbar pb-24 px-5 pt-2">
      
      {/* Header */}
      <div className="flex justify-between items-center mt-2 mb-4 shrink-0">
        <h2 className="text-[19px] font-extrabold text-white">Profile & Settings</h2>
        <button
          onClick={() => setActiveTab("home")}
          className="w-[38px] h-[38px] rounded-xl bg-app-card border border-white/[0.09] flex items-center justify-center text-text-sec hover:text-white cursor-pointer active:scale-95 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Hero details */}
      <div className="bg-app-card border border-white/[0.09] rounded-2xl p-4 mb-4.5 flex items-center gap-3.5">
        <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center font-extrabold text-2xl text-white relative shadow-md shrink-0">
          {activeName[0] || 'A'}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-app-bg border-2 border-app-card flex items-center justify-center text-text-sec cursor-pointer hover:text-white">
            <Edit2 className="w-3.5 h-3.5" onClick={() => setEditMode(!editMode)} />
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-1">
          {editMode ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="h-8 rounded bg-app-card2 border border-white/10 text-white font-bold text-xs px-2.5"
              />
              <input
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="h-8 rounded bg-app-card2 border border-white/10 text-white font-medium text-xs px-2.5"
              />
              <button
                onClick={handleSaveProfile}
                className="h-7 bg-gold rounded text-[#0A0A0A] font-extrabold text-[10px] uppercase tracking-wider cursor-pointer"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-base font-extrabold text-white leading-tight">{activeName}</h3>
              <span className="text-[11.5px] text-text-sec block mt-0.5 leading-none">{activeEmail}</span>
              <span className="inline-flex items-center gap-1.5 text-[9.5px] font-extrabold text-gold bg-gold/15 px-2.5 py-1 rounded-full mt-2 uppercase tracking-wide">
                ✦ PRO MEMBER
              </span>
            </>
          )}
        </div>
      </div>

      {/* Fitness Profile Form inputs */}
      <div className="text-[10px] font-extrabold text-text-sec uppercase tracking-widest mb-2 px-1">Fitness Metrics</div>
      <div className="bg-app-card border border-white/[0.09] rounded-2xl overflow-hidden mb-4.5">
        {isEditingMetrics ? (
          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span>Height (cm):</span>
              <input
                type="number"
                value={heightVal}
                onChange={(e) => setHeightVal(parseInt(e.target.value) || 0)}
                className="w-20 h-8 rounded border border-white/10 bg-app-card2 text-white text-center font-bold"
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>Weight (kg):</span>
              <input
                type="number"
                value={weightVal}
                onChange={(e) => setWeightVal(parseFloat(e.target.value) || 0)}
                className="w-20 h-8 rounded border border-white/10 bg-app-card2 text-white text-center font-bold"
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>Age (yrs):</span>
              <input
                type="number"
                value={ageVal}
                onChange={(e) => setAgeVal(parseInt(e.target.value) || 0)}
                className="w-20 h-8 rounded border border-white/10 bg-app-card2 text-white text-center font-bold"
              />
            </div>
            <button
              onClick={handleSaveMetrics}
              className="h-9 bg-gold rounded-xl text-[#0A0A0A] font-extrabold text-xs cursor-pointer mt-2"
            >
              Save Metrics
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div
              onClick={() => setIsEditingMetrics(true)}
              className="flex justify-between items-center py-3.5 px-4 cursor-pointer hover:bg-white/[0.02]"
            >
              <span className="text-xs font-bold text-white">Height</span>
              <span className="text-xs font-bold text-text-sec flex items-center gap-1.5">
                <span>{profile.height} cm</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div
              onClick={() => setIsEditingMetrics(true)}
              className="flex justify-between items-center py-3.5 px-4 border-t border-white/[0.05] cursor-pointer hover:bg-white/[0.02]"
            >
              <span className="text-xs font-bold text-white">Weight</span>
              <span className="text-xs font-bold text-text-sec flex items-center gap-1.5">
                <span>{profile.weight} kg</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div
              onClick={() => setIsEditingMetrics(true)}
              className="flex justify-between items-center py-3.5 px-4 border-t border-white/[0.05] cursor-pointer hover:bg-white/[0.02]"
            >
              <span className="text-xs font-bold text-white">Age</span>
              <span className="text-xs font-bold text-text-sec flex items-center gap-1.5">
                <span>{profile.age} years</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Goals selection chips */}
      <div className="text-[10px] font-extrabold text-text-sec uppercase tracking-widest mb-2 px-1">Selected Goals</div>
      <div className="bg-app-card border border-white/[0.09] rounded-2xl p-4 mb-4.5">
        <div className="flex flex-wrap gap-2">
          {["Lose Weight", "Build Muscle", "Improve Strength", "Endurance", "Flexibility"].map((goal) => {
            const isActive = goals.includes(goal);
            return (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`h-9 px-4.5 rounded-full text-xs font-bold cursor-pointer transition-all border ${
                  isActive
                    ? "bg-gold-gradient border-transparent text-white"
                    : "bg-app-card2 border-white/5 text-text-sec"
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment selection chips */}
      <div className="text-[10px] font-extrabold text-text-sec uppercase tracking-widest mb-2 px-1">Equipment Available</div>
      <div className="bg-app-card border border-white/[0.09] rounded-2xl p-4 mb-4.5">
        <div className="flex flex-wrap gap-2">
          {["Dumbbells", "Barbell", "Resistance Bands", "Pull-up Bar", "Full Gym"].map((equipItem) => {
            const isActive = equipment.includes(equipItem);
            return (
              <button
                key={equipItem}
                onClick={() => toggleEquipment(equipItem)}
                className={`h-9 px-4.5 rounded-full text-xs font-bold cursor-pointer transition-all border ${
                  isActive
                    ? "bg-gold-gradient border-transparent text-white"
                    : "bg-app-card2 border-white/5 text-text-sec"
                }`}
              >
                {equipItem}
              </button>
            );
          })}
        </div>
      </div>

      {/* Injury History */}
      <div className="text-[10px] font-extrabold text-text-sec uppercase tracking-widest mb-2 px-1">Injury History</div>
      <div className="bg-app-card border border-white/[0.09] rounded-2xl overflow-hidden mb-4.5 flex flex-col">
        <div className="flex items-center justify-between p-3.5 border-b border-white/5">
          <div>
            <b className="text-xs font-bold text-white block">Lower Back Strain</b>
            <span className="text-[10px] text-text-sec block mt-0.5">Logged March 2026</span>
          </div>
          <span className="px-2.5 py-0.5 text-[9px] font-extrabold bg-amber-accent/15 text-amber-accent rounded-full">
            Healing
          </span>
        </div>
        <div className="flex items-center justify-between p-3.5">
          <div>
            <b className="text-xs font-bold text-white block">Right Shoulder Impingement</b>
            <span className="text-[10px] text-text-sec block mt-0.5">Logged Nov 2025</span>
          </div>
          <span className="px-2.5 py-0.5 text-[9px] font-extrabold bg-lime-accent/15 text-lime-accent rounded-full">
            Resolved
          </span>
        </div>
      </div>

      {/* AI Preferences Switches */}
      <div className="text-[10px] font-extrabold text-text-sec uppercase tracking-widest mb-2 px-1">AI Coaching Options</div>
      <div className="bg-app-card border border-white/[0.09] rounded-2xl overflow-hidden mb-4.5 flex flex-col">
        {[
          { key: "adaptive", title: "Adaptive Coaching", desc: "Auto-adjust programs on recovery levels" },
          { key: "voice", title: "Voice Feedback", desc: "Spoken gym guide voice alerts" },
          { key: "aggressive", title: "Aggressive Progression", desc: "Speed up loading schemes automatically" },
        ].map((sw) => (
          <div key={sw.key} className="flex justify-between items-center py-3.5 px-4 border-b border-white/5 last:border-none">
            <div className="pr-3">
              <b className="text-xs font-bold text-white block leading-tight">{sw.title}</b>
              <span className="text-[9.5px] text-text-sec block mt-1 leading-tight">{sw.desc}</span>
            </div>
            <button onClick={() => toggleSwitch(sw.key)} className="text-gold cursor-pointer shrink-0">
              {switches[sw.key] ? (
                <ToggleRight className="w-9.5 h-9.5 stroke-[1.5]" />
              ) : (
                <ToggleLeft className="w-9.5 h-9.5 text-white/20 stroke-[1.5]" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Connected Devices */}
      <div className="text-[10px] font-extrabold text-text-sec uppercase tracking-widest mb-2 px-1">Connected Devices</div>
      <div className="bg-app-card border border-white/[0.09] rounded-2xl overflow-hidden mb-4.5 flex flex-col">
        {/* Apple Watch */}
        <div className="flex justify-between items-center py-3.5 px-4 border-b border-white/5">
          <div className="flex gap-3 items-center">
            <div className="w-1.5 h-1.5 bg-lime-accent rounded-full animate-pulse" />
            <div>
              <b className="text-xs font-bold text-white block leading-tight">Apple Watch Series 9</b>
              <span className="text-[9.5px] text-text-sec mt-0.5 block">Synced 2 mins ago</span>
            </div>
          </div>
          <button className="h-7 px-3.5 rounded bg-lime-accent/15 text-lime-accent text-[9.5px] font-extrabold uppercase border border-lime-accent/25">
            Connected
          </button>
        </div>
        
        {/* WHOOP */}
        <div className="flex justify-between items-center py-3.5 px-4 border-b border-white/5">
          <div className="flex gap-3 items-center">
            <div className={`w-1.5 h-1.5 rounded-full ${devices.whoop === "connected" ? "bg-lime-accent animate-pulse" : "bg-text-sec"}`} />
            <div>
              <b className="text-xs font-bold text-white block leading-tight">WHOOP 4.0</b>
              <span className="text-[9.5px] text-text-sec mt-0.5 block">
                {devices.whoop === "connected" ? "Synced now" : "Not connected"}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleConnectDevice("whoop")}
            disabled={devices.whoop === "connecting" || devices.whoop === "connected"}
            className={`h-7 px-3.5 rounded text-[9.5px] font-extrabold uppercase border ${
              devices.whoop === "connected"
                ? "bg-lime-accent/15 text-lime-accent border-lime-accent/25"
                : "bg-app-card2 text-text-sec border-white/5 hover:text-white"
            }`}
          >
            {devices.whoop === "connecting" ? "Linking..." : devices.whoop === "connected" ? "Connected" : "Connect"}
          </button>
        </div>

        {/* Google Fit */}
        <div className="flex justify-between items-center py-3.5 px-4">
          <div className="flex gap-3 items-center">
            <div className={`w-1.5 h-1.5 rounded-full ${devices.google === "connected" ? "bg-lime-accent animate-pulse" : "bg-text-sec"}`} />
            <div>
              <b className="text-xs font-bold text-white block leading-tight">Google Fit</b>
              <span className="text-[9.5px] text-text-sec mt-0.5 block">
                {devices.google === "connected" ? "Synced now" : "Not connected"}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleConnectDevice("google")}
            disabled={devices.google === "connecting" || devices.google === "connected"}
            className={`h-7 px-3.5 rounded text-[9.5px] font-extrabold uppercase border ${
              devices.google === "connected"
                ? "bg-lime-accent/15 text-lime-accent border-lime-accent/25"
                : "bg-app-card2 text-text-sec border-white/5 hover:text-white"
            }`}
          >
            {devices.google === "connecting" ? "Linking..." : devices.google === "connected" ? "Connected" : "Connect"}
          </button>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-gradient-to-br from-[#4a3a10] to-[#8a6a10] rounded-2xl p-4.5 mb-4 text-white">
        <h4 className="text-[14.5px] font-extrabold mb-0.5">FitAI Pro — Premium Active</h4>
        <span className="text-[10px] text-gold-pale/80 block mb-4">Renews on Aug 18, 2026 · $12.99/month</span>
        <button className="w-full h-10.5 rounded-xl bg-white text-[#5c4408] font-extrabold text-xs cursor-pointer active:scale-95 transition-all">
          Manage Premium Subscription
        </button>
      </div>

      {/* Data Export */}
      <div className="bg-app-card border border-white/[0.09] rounded-2xl overflow-hidden mb-4.5">
        <div
          onClick={handleExport}
          className="flex justify-between items-center py-3.5 px-4 cursor-pointer hover:bg-white/[0.02]"
        >
          <div className="flex gap-3 items-center">
            <Download className="w-4 h-4 text-cyan" />
            <b className="text-xs font-bold text-white">Export My Health Logs</b>
          </div>
          <span className="text-xs font-extrabold text-gold font-mono">
            {exportStatus === "preparing" ? "Preparing..." : exportStatus === "ready" ? "✓ Ready" : "CSV / PDF"}
          </span>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="w-full h-13 rounded-2xl border border-red-accent/30 bg-red-accent/5 hover:bg-red-accent/10 text-red-accent font-extrabold text-xs cursor-pointer flex items-center justify-center gap-2 mt-4 transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span>{logoutConfirm ? "Tap Again to Confirm Reset" : "Log Out & Reset State"}</span>
      </button>

    </div>
  );
};
