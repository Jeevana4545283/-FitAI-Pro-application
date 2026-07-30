import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import api from '../lib/api';
import { 
  User, Dumbbell, Activity, HeartPulse, 
  ArrowRight, ArrowLeft, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface ComprehensiveProfile {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  fitnessGoal: string;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  workoutPreference: 'Gym' | 'Home' | 'Both';
  availableTime: number;
  weeklyDays: number;
  hasPastInjuries: boolean;
  injuryDetails: string;
  medicalConditions: string;
  sleepHours: number;
  waterIntake: number;
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Active' | 'Very Active';
  equipment: string[];
}

export const Onboarding: React.FC = () => {
  const { user, completeOnboarding } = useAuth();
  const { updateProfile, toggleGoal, toggleEquipment } = useAppState();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<ComprehensiveProfile>({
    name: user?.name || '',
    age: 25,
    gender: 'Male',
    height: 175,
    weight: 70,
    fitnessGoal: 'Muscle Gain',
    experience: 'Intermediate',
    workoutPreference: 'Gym',
    availableTime: 45,
    weeklyDays: 4,
    hasPastInjuries: false,
    injuryDetails: '',
    medicalConditions: '',
    sleepHours: 8,
    waterIntake: 2.5,
    activityLevel: 'Active',
    equipment: ['Dumbbells', 'Barbell'],
  });

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleEquipmentSelection = (item: string) => {
    setFormData((prev) => {
      const updated = prev.equipment.includes(item)
        ? prev.equipment.filter((e) => e !== item)
        : [...prev.equipment, item];
      return { ...prev, equipment: updated };
    });
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const pastInjuriesList = formData.hasPastInjuries && formData.injuryDetails.trim()
        ? [formData.injuryDetails.trim()]
        : [];
      const medicalConditionsList = formData.medicalConditions.trim()
        ? [formData.medicalConditions.trim()]
        : [];

      // 1. Save profile information to PostgreSQL backend
      await api.put('/profile', {
        userId: user?.userId,
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        fitnessGoal: formData.fitnessGoal,
        experience: formData.experience,
        workoutPreference: formData.workoutPreference,
        availableTime: formData.availableTime,
        weeklyDays: formData.weeklyDays,
        pastInjuries: pastInjuriesList,
        medicalConditions: medicalConditionsList,
        sleepHours: formData.sleepHours,
        waterIntake: formData.waterIntake,
        activityLevel: formData.activityLevel,
        equipment: formData.equipment
      });

      // 2. Sync to AppStateContext locally
      updateProfile({
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        experience: formData.experience,
        gymHome: formData.workoutPreference === 'Home' ? 'home' : 'gym',
      });

      toggleGoal(formData.fitnessGoal);
      formData.equipment.forEach((eq) => toggleEquipment(eq));

      // 3. Mark Onboarding as Completed
      completeOnboarding();
      toast.success(`Profile customized! Welcome to FitAIX, ${formData.name.split(' ')[0]} 👋`);
    } catch (err: any) {
      // Fallback local completion if network issue
      completeOnboarding();
      toast.success(`Welcome to FitAIX, ${formData.name.split(' ')[0]} 👋`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0a0a0a] text-white relative overflow-y-auto">
      {/* Background Glow */}
      <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Step Progress Indicator */}
      <div className="pt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gold font-extrabold uppercase tracking-wider">Build Your Profile</span>
          <span className="text-white/40 font-mono">Step {step} of 4</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-gold transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Multi-Step Container */}
      <div className="my-auto py-4">
        <div className="bg-app-card border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">

          {/* STEP 1: Personal Information */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-gold" /> Personal Details
                </h2>
                <p className="text-xs text-white/40 mt-0.5">Let us know your core body metrics</p>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-white/70">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jeevana"
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:border-gold/60 focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 px-3 text-sm text-white text-center focus:border-gold/60 focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 px-2 text-xs text-white focus:border-gold/60 focus:outline-none font-bold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                      className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 px-3 text-sm text-white text-center focus:border-gold/60 focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                      className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 px-3 text-sm text-white text-center focus:border-gold/60 focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Fitness & Workout Preferences */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gold" /> Fitness & Workouts
                </h2>
                <p className="text-xs text-white/40 mt-0.5">Customize your training preferences</p>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-white/70">Fitness Goal</label>
                <select
                  value={formData.fitnessGoal}
                  onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl py-3 px-3 text-xs text-white focus:border-gold/60 focus:outline-none font-bold"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Maintain Weight">Maintain Weight</option>
                  <option value="Improve Strength">Improve Strength</option>
                  <option value="Improve Endurance">Improve Endurance</option>
                  <option value="General Fitness">General Fitness</option>
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Experience</label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value as any })}
                      className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 px-2 text-xs text-white focus:border-gold/60 font-bold"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Preference</label>
                    <select
                      value={formData.workoutPreference}
                      onChange={(e) => setFormData({ ...formData, workoutPreference: e.target.value as any })}
                      className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 px-2 text-xs text-white focus:border-gold/60 font-bold"
                    >
                      <option value="Gym">Gym</option>
                      <option value="Home">Home</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Daily Time (min)</label>
                    <input
                      type="number"
                      value={formData.availableTime}
                      onChange={(e) => setFormData({ ...formData, availableTime: Number(e.target.value) })}
                      className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 px-3 text-xs text-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Weekly Days</label>
                    <select
                      value={formData.weeklyDays}
                      onChange={(e) => setFormData({ ...formData, weeklyDays: Number(e.target.value) })}
                      className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 px-2 text-xs text-white focus:border-gold/60 font-bold"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                        <option key={d} value={d}>{d} Days / week</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Medical & Lifestyle */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-gold" /> Medical & Lifestyle
                </h2>
                <p className="text-xs text-white/40 mt-0.5">Ensure safe exercise recommendations</p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Injuries */}
                <div className="bg-[#141414] p-3 rounded-2xl border border-white/5 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white/80">Any Past Injuries?</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasPastInjuries: !formData.hasPastInjuries })}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                        formData.hasPastInjuries ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {formData.hasPastInjuries ? 'Yes' : 'No'}
                    </button>
                  </div>

                  {formData.hasPastInjuries && (
                    <input
                      type="text"
                      value={formData.injuryDetails}
                      onChange={(e) => setFormData({ ...formData, injuryDetails: e.target.value })}
                      placeholder="e.g. Lower back strain, Right knee pain"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-gold/60"
                    />
                  )}
                </div>

                {/* Medical conditions */}
                <input
                  type="text"
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                  placeholder="Medical conditions (Optional e.g. Asthma)"
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 px-3 text-xs text-white focus:border-gold/60"
                />

                {/* Sleep & Water */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Sleep (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.sleepHours}
                      onChange={(e) => setFormData({ ...formData, sleepHours: Number(e.target.value) })}
                      className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2 px-3 text-xs text-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Water (L / day)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.waterIntake}
                      onChange={(e) => setFormData({ ...formData, waterIntake: Number(e.target.value) })}
                      className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2 px-3 text-xs text-white text-center font-bold"
                    />
                  </div>
                </div>

                {/* Activity Level */}
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Daily Activity Level</label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
                    className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 px-3 text-xs text-white focus:border-gold/60 font-bold"
                  >
                    <option value="Sedentary">Sedentary (Desk job)</option>
                    <option value="Lightly Active">Lightly Active (1-3 days active)</option>
                    <option value="Active">Active (3-5 days active)</option>
                    <option value="Very Active">Very Active (Hard exercise daily)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Equipment Available */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-gold" /> Available Equipment
                </h2>
                <p className="text-xs text-white/40 mt-0.5">Select all gear you have access to</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  'Dumbbells',
                  'Resistance Bands',
                  'Barbell',
                  'Bench',
                  'Pull-up Bar',
                  'Treadmill',
                  'No Equipment',
                ].map((item) => {
                  const isSelected = formData.equipment.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleEquipmentSelection(item)}
                      className={`p-3 rounded-2xl text-xs font-bold border transition text-left flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-gold/20 border-gold text-gold shadow-md shadow-gold/10'
                          : 'bg-[#141414] border-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      <span>{item}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-gold" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex-1 bg-white/5 border border-white/10 text-white font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center gap-1 hover:bg-white/10 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-gold text-[#0a0a0a] font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-1 shadow-lg shadow-gold/20 hover:bg-gold/90 transition cursor-pointer"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={isSubmitting}
                className="flex-1 bg-gold text-[#0a0a0a] font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-1 shadow-lg shadow-gold/20 hover:bg-gold/90 transition uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Complete Profile <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
