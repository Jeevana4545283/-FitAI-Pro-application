import React, { useState } from "react";
import { AppStateProvider, useAppState } from "../context/AppStateContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
import { ForgotPassword } from "../components/ForgotPassword";
import { ResetPassword } from "../components/ResetPassword";
import { Onboarding } from "../components/Onboarding";
import { MobileFrame } from "../components/MobileFrame";
import { BottomNav } from "../components/BottomNav";
import { Dashboard } from "../components/Dashboard";
import { Workout } from "../components/Workout";
import { Analytics } from "../components/Analytics";
import { Recovery } from "../components/Recovery";
import { Coach } from "../components/Coach";
import { Profile } from "../components/Profile";
import { Nutrition } from "../components/Nutrition";
import { NotificationsModal } from "../components/NotificationsModal";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

function MainAppContent() {
  const [activeTab, setActiveTab] = useState("home");
  const [showMealModal, setShowMealModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { logMeal } = useAppState();

  // Meal modal states
  const [kcal, setKcal] = useState(400);
  const [p, setP] = useState(25);
  const [c, setC] = useState(45);
  const [f, setF] = useState(10);

  const handleLog = () => {
    logMeal(kcal, p, c, f);
    setShowMealModal(false);
  };

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {activeTab === "home" && (
              <Dashboard
                setActiveTab={setActiveTab}
                openMealModal={() => setShowMealModal(true)}
                openNotificationsModal={() => setShowNotifications(true)}
              />
            )}
            {activeTab === "workout" && <Workout setActiveTab={setActiveTab} />}
            {activeTab === "analytics" && <Analytics setActiveTab={setActiveTab} />}
            {activeTab === "recovery" && <Recovery setActiveTab={setActiveTab} />}
            {activeTab === "profile" && <Profile setActiveTab={setActiveTab} />}
            {activeTab === "nutrition" && <Nutrition setActiveTab={setActiveTab} />}
          </motion.div>
        </AnimatePresence>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} openMealModal={() => setShowMealModal(true)} />
        
        {/* Global AI Fitness Assistant (Floating Action Button & Panel Overlay) */}
        <Coach activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Log Meal Modal */}
      {showMealModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-app-card border border-white/10 rounded-3xl p-5 w-full max-w-[320px] flex flex-col gap-4 text-white">
            <h3 className="text-sm font-extrabold tracking-wider uppercase text-gold">Log Premium Meal</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label>Kcal: <input type="number" value={kcal} onChange={(e) => setKcal(Number(e.target.value))} className="w-full bg-app-card2 rounded p-1.5 mt-1 border border-white/5" /></label>
              <label>Protein (g): <input type="number" value={p} onChange={(e) => setP(Number(e.target.value))} className="w-full bg-app-card2 rounded p-1.5 mt-1 border border-white/5" /></label>
              <label>Carbs (g): <input type="number" value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full bg-app-card2 rounded p-1.5 mt-1 border border-white/5" /></label>
              <label>Fats (g): <input type="number" value={f} onChange={(e) => setF(Number(e.target.value))} className="w-full bg-app-card2 rounded p-1.5 mt-1 border border-white/5" /></label>
            </div>
            <div className="flex gap-2">
              <button onClick={handleLog} className="flex-1 bg-gold text-[#0a0a0a] font-extrabold py-2 rounded-xl text-xs">Confirm</button>
              <button onClick={() => setShowMealModal(false)} className="flex-1 bg-white/5 border border-white/5 py-2 rounded-xl text-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer Modal */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        setActiveTab={setActiveTab}
      />
    </MobileFrame>
  );
}

function AuthFlow() {
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot-password' | 'reset-password'>('login');

  return (
    <MobileFrame>
      <AnimatePresence mode="wait">
        <motion.div
          key={authView}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="flex-1 flex flex-col min-h-0"
        >
          {authView === 'login' && <Login onNavigate={(v) => setAuthView(v)} />}
          {authView === 'register' && <Register onNavigate={(v) => setAuthView(v)} />}
          {authView === 'forgot-password' && <ForgotPassword onNavigate={(v) => setAuthView(v)} />}
          {authView === 'reset-password' && <ResetPassword onNavigate={(v) => setAuthView(v)} />}
        </motion.div>
      </AnimatePresence>
    </MobileFrame>
  );
}

function AppWithAuth() {
  const { hasCompletedOnboarding } = useAuth();

  return (
    <ProtectedRoute fallback={<AuthFlow />}>
      {!hasCompletedOnboarding ? (
        <MobileFrame>
          <Onboarding />
        </MobileFrame>
      ) : (
        <MainAppContent />
      )}
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <AppWithAuth />
        <Toaster position="top-right" />
      </AppStateProvider>
    </AuthProvider>
  );
}
