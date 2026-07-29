"use client";

import React, { useState, useEffect } from "react";

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center py-8 px-4 font-sans select-none antialiased">
      {/* Outer Phone Container - hidden on small viewports and render full screen */}
      <div className="relative w-full max-w-[390px] h-[844px] sm:h-[844px] bg-app-bg sm:border-[10px] sm:border-black sm:rounded-[52px] sm:box-content sm:shadow-[0_50px_100px_-25px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
        
        {/* Notch - hidden on mobile viewports */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[26px] bg-black rounded-b-[18px] z-30 pointer-events-none" />

        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 pt-5 pb-1 text-[13px] font-bold text-white z-20 shrink-0">
          <span>{time}</span>
          <div className="flex gap-1.5 items-center">
            {/* Cell Signal */}
            <svg width="17" height="9" viewBox="0 0 17 9" className="fill-current text-white">
              <rect x="0" y="5" width="2.5" height="4" rx="0.5" />
              <rect x="3.5" y="4" width="2.5" height="5" rx="0.5" />
              <rect x="7" y="2" width="2.5" height="7" rx="0.5" />
              <rect x="10.5" y="0" width="2.5" height="9" rx="0.5" className="opacity-40" />
            </svg>
            {/* Wifi Icon */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-white">
              <path d="M1 3.5a10 10 0 0113 0M3.2 6a7 7 0 018.6 0M5.5 8.3a4 4 0 014 0" />
              <circle cx="7.5" cy="9.8" r="0.8" fill="currentColor" />
            </svg>
            {/* Battery */}
            <svg width="22" height="11" viewBox="0 0 22 11" fill="none" className="text-white">
              <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.8" />
              <rect x="2" y="2" width="15" height="7" rx="1.5" fill="currentColor" />
              <path d="M20 3.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Dynamic Screen Content Wrapper */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {children}
        </div>
      </div>
    </div>
  );
};
