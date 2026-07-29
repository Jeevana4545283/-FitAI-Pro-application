"use client";

import React, { useState } from "react";
import { Home, Dumbbell, BarChart2, Heart, Plus, MessageSquare, Droplet, Coffee, Camera, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openMealModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, openMealModal }) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const { addWater } = useAppState();

  const handleQuickWater = () => {
    addWater();
    setShowQuickActions(false);
  };

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0A0A0A]/90 backdrop-blur-md border-t border-white/[0.09] flex items-center justify-around px-2 z-30 select-none">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-2 px-3.5 rounded-xl transition-all duration-200 ${
            activeTab === "home" ? "text-gold bg-gold/10" : "text-text-sec hover:text-white"
          }`}
        >
          <Home className="w-5 h-5 stroke-[2]" />
          <span>Home</span>
        </button>

        {/* Workout */}
        <button
          onClick={() => setActiveTab("workout")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-2 px-3.5 rounded-xl transition-all duration-200 ${
            activeTab === "workout" ? "text-gold bg-gold/10" : "text-text-sec hover:text-white"
          }`}
        >
          <Dumbbell className="w-5 h-5 stroke-[2]" />
          <span>Workout</span>
        </button>

        {/* Center FAB */}
        <div className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="w-[52px] h-[52px] rounded-full bg-gold-gradient flex items-center justify-center text-white shadow-[0_10px_24px_-6px_rgba(245,196,0,0.6)] -mt-6 cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <motion.div
              animate={{ rotate: showQuickActions ? 135 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Plus className="w-5.5 h-5.5 stroke-[2.5]" />
            </motion.div>
          </button>
        </div>

        {/* Analytics */}
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-2 px-3.5 rounded-xl transition-all duration-200 ${
            activeTab === "analytics" ? "text-gold bg-gold/10" : "text-text-sec hover:text-white"
          }`}
        >
          <BarChart2 className="w-5 h-5 stroke-[2]" />
          <span>Analytics</span>
        </button>

        {/* Recovery */}
        <button
          onClick={() => setActiveTab("recovery")}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-2 px-3.5 rounded-xl transition-all duration-200 ${
            activeTab === "recovery" ? "text-gold bg-gold/10" : "text-text-sec hover:text-white"
          }`}
        >
          <Heart className="w-5 h-5 stroke-[2]" />
          <span>Recovery</span>
        </button>
      </div>

      {/* Quick Actions Drawer/Modal */}
      <AnimatePresence>
        {showQuickActions && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickActions(false)}
              className="absolute inset-0 bg-black z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute bottom-24 left-4 right-4 bg-app-card/95 border border-white/[0.09] rounded-3xl p-5 z-50 backdrop-blur-lg shadow-2xl"
            >
              <h3 className="text-sm font-extrabold text-white mb-4 tracking-wide uppercase">Quick Actions</h3>
              <div className="grid grid-cols-4 gap-4">
                
                {/* Ask Coach */}
                <button
                  onClick={() => {
                    setActiveTab("coach");
                    setShowQuickActions(false);
                  }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold flex items-center justify-center transform active:scale-95 transition-transform duration-100">
                    <MessageSquare className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[9.5px] font-bold text-text-sec text-center leading-tight">Ask Coach</span>
                </button>

                {/* Log Meal */}
                <button
                  onClick={() => {
                    setShowQuickActions(false);
                    openMealModal();
                  }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-accent/15 text-amber-accent flex items-center justify-center transform active:scale-95 transition-transform duration-100">
                    <Coffee className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[9.5px] font-bold text-text-sec text-center leading-tight">Log Meal</span>
                </button>

                {/* Log Water */}
                <button
                  onClick={handleQuickWater}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center transform active:scale-95 transition-transform duration-100">
                    <Droplet className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[9.5px] font-bold text-text-sec text-center leading-tight">Log Water</span>
                </button>

                {/* Scan Food */}
                <button
                  onClick={() => {
                    setActiveTab("nutrition");
                    setShowQuickActions(false);
                  }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-lime-accent/15 text-lime-accent flex items-center justify-center transform active:scale-95 transition-transform duration-100">
                    <Camera className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[9.5px] font-bold text-text-sec text-center leading-tight">Scan Food</span>
                </button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
