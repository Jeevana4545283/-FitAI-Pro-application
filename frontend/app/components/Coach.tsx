"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, Sparkles, X, Minimize2, Maximize2, Trash2, 
  RefreshCw, Mic, Volume2, VolumeX, BrainCircuit, User,
  CheckCircle2, Flame, Award, Dumbbell, Coffee, Droplet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import axios from "axios";

// Base API configuration
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/coach",
  timeout: 4000
});

interface CoachProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export const Coach: React.FC<CoachProps> = ({ activeTab, setActiveTab }) => {
  const {
    profile,
    recoveryScore,
    caloriesToday,
    proteinToday,
    carbsToday,
    waterToday,
    xp,
    level,
    workoutStreak
  } = useAppState();

  // Chat window state controls
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Draggable FAB coordinates state
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem("fitaix_fab_position");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default bottom-right position in a 390x844 box
    return { x: 326, y: 668 };
  });

  const isDragging = useRef(false);
  const dragStartCoords = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = false;
    dragStartCoords.current = { x: e.clientX, y: e.clientY };
    dragStartPos.current = { ...position };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    const dx = e.clientX - dragStartCoords.current.x;
    const dy = e.clientY - dragStartCoords.current.y;
    
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      isDragging.current = true;
    }

    if (isDragging.current) {
      let newX = dragStartPos.current.x + dx;
      let newY = dragStartPos.current.y + dy;

      // Bound constraints inside 390x844 viewport
      newX = Math.max(16, Math.min(326, newX));
      newY = Math.max(16, Math.min(716, newY));

      setPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    if (isDragging.current) {
      // Snapping to nearest left or right boundary
      const leftEdge = 16;
      const rightEdge = 326;
      const snapX = position.x < 171 ? leftEdge : rightEdge;
      
      const snappedPosition = { x: snapX, y: position.y };
      setPosition(snappedPosition);
      try {
        localStorage.setItem("fitaix_fab_position", JSON.stringify(snappedPosition));
      } catch (err) {}
      isDragging.current = false;
    } else {
      setIsOpen(true);
      setIsMinimized(false);
      setHasNewSuggestion(false);
    }
  };

  // Message history & input states
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewSuggestion, setHasNewSuggestion] = useState(true);

  // Speech states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Sync bottom navigation "coach" tab activation
  useEffect(() => {
    if (activeTab === "coach") {
      setIsOpen(true);
      setIsMinimized(false);
    }
  }, [activeTab]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("fitaix_coach_chat");
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      } else {
        // Default initial welcome message
        const welcomeMsg: ChatMessage = {
          id: "welcome",
          sender: "coach",
          text: `Hi ${profile.name.split(" ")[0]}! I'm your AI Coach. I've synced with your stats:\n- Recovery: **${recoveryScore}%**\n- Water: **${waterToday}L**\n- Calories Logged: **${caloriesToday} kcal**\n\nHow can I help you crush your goals today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setChatHistory([welcomeMsg]);
      }
    } catch (e) {
      console.error("Local storage read error", e);
    }
  }, []);

  // Save chat history to localStorage
  const saveChatHistory = (history: ChatMessage[]) => {
    setChatHistory(history);
    try {
      localStorage.setItem("fitaix_coach_chat", JSON.stringify(history));
    } catch (e) {
      console.error("Local storage save error", e);
    }
  };

  // Scroll to bottom when history shifts
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping, isOpen]);

  // Web Speech API - Speech Recognition (Voice Input)
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setInputText(resultText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Web Speech API - Text to Speech (Voice Output)
  const handleVoiceSpeak = (text: string) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean text from markdown bold styling before reading
    const cleanText = text.replace(/\*\*/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    speechUtteranceRef.current = utterance;

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Call LLM API (Mock calling with direct backend backup)
  const callLLMApi = async (userMessage: string): Promise<string> => {
    try {
      const res = await api.post("/chat", { message: userMessage, contextCategory: activeTab });
      if (res.data && res.data.text) {
        return res.data.text;
      }
    } catch (err) {
      console.warn("LLM API backend unreachable, generating local expert response:", err);
    }

    // Smart responsive rules based on keywords
    const query = userMessage.toLowerCase();
    if (query.includes("sleep") || query.includes("recovery")) {
      return `Your recovery score is currently at **${recoveryScore}%** based on **7h 45m** of restorative sleep! Your Central Nervous System is fully recovered and ready for training today.`;
    }
    if (query.includes("workout") || query.includes("exercise") || query.includes("training")) {
      return `Based on your goal, I suggest a **Push hypertrophy split** today focusing on chest. Log your sets inside the Workout panel to gain +100 XP!`;
    }
    if (query.includes("protein") || query.includes("meal") || query.includes("nutrition")) {
      return `You logged **${proteinToday}g** of protein today. To reach your daily macro goals, try eating 25g of protein via chicken breasts or a whey protein shake.`;
    }
    if (query.includes("water") || query.includes("hydration")) {
      return `You've drunk **${waterToday}L** of water today. Log another 0.8L to hit your target!`;
    }
    return `Keep up the progress! I see you are on a **${workoutStreak}-day streak**. Let me know how I can adjust your workout splits or nutrition macros!`;
  };

  // Send message action
  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedHistory = [...chatHistory, userMessage];
    saveChatHistory(updatedHistory);
    setInputText("");
    setIsTyping(true);

    // Call AI
    const replyText = await callLLMApi(textToSend);

    const coachMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: "coach",
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setIsTyping(false);
    saveChatHistory([...updatedHistory, coachMessage]);

    // Speak automatically if desired
    // handleVoiceSpeak(replyText);
  };

  // Utility Actions
  const handleClearChat = () => {
    const defaultMsg: ChatMessage = {
      id: "welcome",
      sender: "coach",
      text: `Chat cleared. Ready for a new consultation, ${profile.name.split(" ")[0]}!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    saveChatHistory([defaultMsg]);
  };

  const handleNewConversation = () => {
    handleClearChat();
    handleStopSpeaking();
    alert("New conversation started!");
  };

  // Render markdown helper (Bold markdown wrapper)
  const renderMessageText = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      // Basic check for list item
      const isListItem = line.startsWith("- ") || line.startsWith("* ");
      const content = isListItem ? line.substring(2) : line;

      const parsedElements = content.split("**").map((chunk, idx) => {
        if (idx % 2 === 1) {
          return <strong key={idx} className="text-gold font-extrabold">{chunk}</strong>;
        }
        return chunk;
      });

      if (isListItem) {
        return (
          <li key={lineIdx} className="ml-4 list-disc text-[11.5px] mt-1 text-[#B0AA9A]">
            {parsedElements}
          </li>
        );
      }

      return (
        <p key={lineIdx} className="text-[11.5px] leading-relaxed mt-1 text-[#B0AA9A]">
          {parsedElements}
        </p>
      );
    });
  };

  return (
    <>
      {/* 1. FLOATING ACTION BUTTON (Docked bottom-right inside Mobile Container) */}
      <div
        onClick={() => {
          if (!isDragging.current) {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }
        }}
        className={`absolute bottom-20 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-[#F5C400] to-[#FFB300] text-black shadow-[0_8px_24px_rgba(245,196,0,0.45)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 z-40 border border-white/10 select-none ${
          hasNewSuggestion ? "animate-pulse" : ""
        }`}
      >
        <BrainCircuit className="w-5.5 h-5.5 pointer-events-none" />
        {hasNewSuggestion && (
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-accent border-2 border-black pointer-events-none" />
        )}
      </div>

      {/* 2. CHAT DRAWER PANEL OVERLAY (Strictly Inside Mobile Frame) */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 150, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 150, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`absolute inset-x-3 bottom-[72px] bg-[#161616] border border-white/[0.09] rounded-[24px] shadow-2xl z-40 flex flex-col overflow-hidden transition-all duration-300 ${
              isMaximized ? "top-4 bottom-[72px] rounded-[24px]" : "h-[450px] max-h-[72vh]"
            }`}
          >
            {/* Panel Header */}
            <div className="flex justify-between items-center px-4 py-3 bg-[#101010] border-b border-white/[0.05] shrink-0">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-[#F5C400] fill-[#F5C400]/10" />
                <div>
                  <h3 className="text-xs.5 font-extrabold text-white leading-tight">FitAI Coach</h3>
                  <span className="text-[9px] text-[#A3E635] font-bold block leading-none mt-0.5">Online 24/7</span>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMinimized(true)}
                  title="Minimize"
                  className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#B0AA9A] hover:text-white cursor-pointer transition-all"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  title="Toggle Fullscreen"
                  className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#B0AA9A] hover:text-white cursor-pointer transition-all"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleClearChat}
                  title="Clear Conversation"
                  className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#B0AA9A] hover:text-white cursor-pointer transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setActiveTab("home");
                  }}
                  title="Close Window"
                  className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-red-accent cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages area */}
            <div className="flex-grow overflow-y-auto no-scrollbar p-3.5 flex flex-col gap-3.5 bg-[#0A0A0A]/40">
              {chatHistory.map((msg) => {
                const isMe = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 max-w-[88%] ${
                      isMe ? "self-end flex-row-reverse" : "self-start"
                    }`}
                  >
                    {/* Avatar bubble */}
                    <div
                      className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-extrabold text-[10px] text-white select-none ${
                        isMe
                          ? "bg-gradient-to-br from-[#FFB300] to-[#F5C400] text-black"
                          : "bg-[#161616] border border-[#F5C400]/20 text-[#F5C400]"
                      }`}
                    >
                      {isMe ? "P" : "AI"}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div
                        className={`p-3 rounded-2xl break-words overflow-hidden ${
                          isMe
                            ? "bg-gradient-to-tr from-[#CA8A04] to-[#F5C400] text-black rounded-tr-none font-bold"
                            : "bg-[#161616] border border-white/[0.05] text-[#B0AA9A] rounded-tl-none font-medium"
                        }`}
                      >
                        {isMe ? (
                          <p className="text-[11.5px] leading-relaxed break-words">{msg.text}</p>
                        ) : (
                          renderMessageText(msg.text)
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between px-1 mt-0.5">
                        <span className="text-[8px] text-[#B0AA9A]/60 font-semibold uppercase">
                          {msg.timestamp}
                        </span>
                        {!isMe && (
                          <button
                            onClick={() => handleVoiceSpeak(msg.text)}
                            className="text-[#B0AA9A] hover:text-[#F5C400] transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing simulation dots */}
              {isTyping && (
                <div className="flex gap-3 self-start">
                  <div className="w-7.5 h-7.5 rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] bg-[#161616] border border-[#F5C400]/25 text-[#F5C400]">
                    AI
                  </div>
                  <div className="bg-[#161616] border border-white/[0.05] p-3 rounded-2xl rounded-tl-none flex gap-1 items-center h-8">
                    <span className="w-1.5 h-1.5 bg-text-sec rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-text-sec rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-text-sec rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Speaking voice stop controls banner */}
            {isSpeaking && (
              <div className="bg-[#101010] border-t border-white/5 px-4 py-2 flex justify-between items-center text-[10px] font-bold text-[#F5C400] shrink-0">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  Speaking AI response...
                </span>
                <button
                  onClick={handleStopSpeaking}
                  className="px-2 py-0.5 bg-white/5 border border-white/10 text-white rounded cursor-pointer"
                >
                  Stop Voice
                </button>
              </div>
            )}

            {/* Quick Action Prompt Chips */}
            <div className="px-4.5 py-2.5 flex gap-2 overflow-x-auto no-scrollbar shrink-0 bg-[#101010]/30 select-none border-t border-white/[0.03]">
              {[
                { label: "Create Workout Plan", q: "Generate today's Push workout" },
                { label: "High-Protein Meals", q: "Recommend high protein snacks" },
                { label: "Analyze Sleep", q: "Tell me about sleep recovery scores" },
                { label: "New PR Plan", q: "How can I bench press 90kg?" }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.q)}
                  className="shrink-0 h-7.5 px-3.5 rounded-full border border-white/[0.05] bg-[#101010] text-[#B0AA9A] hover:text-white font-bold text-[10px] cursor-pointer transition-all active:scale-95"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* TextInput Form Panel */}
            <div className="px-4.5 pb-4 pt-2.5 flex gap-2 bg-[#101010] border-t border-white/[0.05] items-center shrink-0">
              {/* Mic Input Trigger Button */}
              <button
                onClick={handleVoiceInput}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border cursor-pointer transition-all active:scale-90 ${
                  isListening
                    ? "bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] animate-pulse"
                    : "bg-black/50 border-white/5 text-[#B0AA9A] hover:text-white"
                }`}
              >
                <Mic className="w-4.5 h-4.5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask FitAI Coach anything..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-grow h-10 bg-black/40 border border-white/5 rounded-xl text-white font-bold text-[11px] px-3.5 focus:outline-none focus:border-[#F5C400]/25"
              />

              <button
                onClick={() => handleSend()}
                className="w-10 h-10 bg-gradient-to-r from-[#F5C400] to-[#FFB300] rounded-xl flex items-center justify-center text-black font-extrabold cursor-pointer active:scale-90 transition-all shadow shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MINIMIZED PANEL BANNER POPUP */}
      {isOpen && isMinimized && (
        <div
          onClick={() => setIsMinimized(false)}
          style={{ left: Math.max(16, position.x - 146), top: position.y + 4 }}
          className="absolute h-10 px-3.5 rounded-full bg-[#161616] border border-gold/30 shadow-[0_4px_16px_rgba(245,196,0,0.25)] flex items-center gap-2.5 cursor-pointer hover:bg-white/[0.02] z-30 transition-all select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-ping" />
          <span className="text-[10px] text-[#F5C400] font-extrabold">Chat Minimized</span>
        </div>
      )}
    </>
  );
};
