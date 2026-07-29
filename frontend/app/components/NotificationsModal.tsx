import React from "react";
import { Bell, Check, Trash2, X, Dumbbell, Droplet, Sparkles, Trophy, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import toast from "react-hot-toast";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, setActiveTab }) => {
  const { notifications, dismissNotification, clearAllNotifications } = useAppState();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleItemClick = (item: any) => {
    dismissNotification(item.id);
    onClose();

    if (item.category === "workout") {
      setActiveTab("workout");
      toast.success("Opened Workout Details!");
    } else if (item.category === "water") {
      setActiveTab("nutrition");
      toast.success("Opened Nutrition & Hydration!");
    } else if (item.category === "recovery") {
      setActiveTab("recovery");
      toast.success("Opened Recovery & Health!");
    } else if (item.category === "social") {
      setActiveTab("analytics");
      toast.success("Opened Leaderboard & Social!");
    } else {
      setActiveTab("home");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "workout":
        return <Dumbbell className="w-4 h-4 text-gold" />;
      case "water":
        return <Droplet className="w-4 h-4 text-cyan-400" />;
      case "recovery":
        return <Sparkles className="w-4 h-4 text-lime-400" />;
      case "social":
        return <Trophy className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-gold" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#161616] border border-white/10 rounded-[28px] p-5 w-full max-w-[360px] flex flex-col gap-4 text-white shadow-2xl overflow-hidden max-h-[80vh]"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-tight">Notifications</h3>
                  <span className="text-[10px] font-bold text-[#B0AA9A] block mt-0.5">
                    {unreadCount > 0 ? `${unreadCount} Unread Alerts` : "All Caught Up"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    title="Mark all read"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gold text-xs font-bold transition cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center cursor-pointer active:scale-90 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-grow overflow-y-auto no-scrollbar flex flex-col gap-2.5 my-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 group ${
                    n.unread
                      ? "bg-[#1E1E1E] border-gold/40 shadow-sm"
                      : "bg-[#121212] border-white/5 opacity-75 hover:opacity-100"
                  }`}
                >
                  {/* Category Icon */}
                  <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                    {getCategoryIcon(n.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-extrabold text-white truncate block">{n.title}</h4>
                      <span className="text-[9px] text-[#B0AA9A] font-semibold shrink-0 ml-1">{n.time}</span>
                    </div>
                    <p className="text-[10.5px] text-[#B0AA9A] leading-relaxed truncate block mt-0.5">{n.desc}</p>
                  </div>

                  {/* Arrow Indicator */}
                  <ChevronRight className="w-4 h-4 text-[#B0AA9A] group-hover:text-gold shrink-0 transition" />
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-8 text-[#B0AA9A] text-xs font-bold flex flex-col items-center gap-2">
                  <Bell className="w-8 h-8 opacity-40" />
                  <span>No active notifications.</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
