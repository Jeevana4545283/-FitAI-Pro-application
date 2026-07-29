"use client";

import React, { useState, useRef, useEffect } from "react";
import { Coffee, Search, Plus, Sparkles, Check, ChevronLeft, RefreshCw, Barcode, Camera, ShieldAlert, X, Upload, Edit3, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import toast from "react-hot-toast";

interface NutritionProps {
  setActiveTab: (tab: string) => void;
}

export const Nutrition: React.FC<NutritionProps> = ({ setActiveTab }) => {
  const { caloriesToday, proteinToday, carbsToday, fatsToday, logMeal } = useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [ingredients, setIngredients] = useState("Chicken breast, eggs, spinach, avocado");
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any | null>(null);

  // Live camera & Scan food states
  const [showScanner, setShowScanner] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanStatus, setScanStatus] = useState<"scanning" | "scanned" | "idle">("idle");
  const [scannedFood, setScannedFood] = useState<any | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Manual log states
  const [manualCal, setManualCal] = useState(450);
  const [manualProt, setManualProt] = useState(30);
  const [manualCarb, setManualCarb] = useState(40);
  const [manualFat, setManualFat] = useState(12);

  // Clean up camera stream on unmount or close
  useEffect(() => {
    return () => {
      stopLiveCamera();
    };
  }, []);

  const startLiveCamera = async () => {
    setShowScanner(true);
    setIsCameraActive(true);
    setUploadedImagePreview(null);
    setScanStatus("idle");
    setScannedFood(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access denied/unavailable, fallback to simulation mode:", err);
      toast.error("Live camera unavailable on desktop browser. Showing simulation camera!");
      setIsCameraActive(false);
      setScanStatus("scanning");
      setTimeout(() => {
        setScanStatus("scanned");
        setScannedFood({
          name: "AI Scanned: High Protein Chicken Bowl",
          kcal: 450,
          protein: 38,
          carbs: 30,
          fats: 12,
          confidence: 97,
        });
      }, 1500);
    }
  };

  const stopLiveCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhotoFromCamera = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setUploadedImagePreview(dataUrl);
        stopLiveCamera();
        setScanStatus("scanning");

        setTimeout(() => {
          setScanStatus("scanned");
          setScannedFood({
            name: "Live AI Capture: Healthy Salmon Salad Bowl",
            kcal: 480,
            protein: 42,
            carbs: 18,
            fats: 14,
            confidence: 98,
          });
          toast.success("Live Photo Recognized!");
        }, 1500);
        return;
      }
    }

    // Fallback if camera stream wasn't actively playing
    setScanStatus("scanning");
    setTimeout(() => {
      setScanStatus("scanned");
      setScannedFood({
        name: "Captured: Avocado & Egg Protein Toast",
        kcal: 380,
        protein: 24,
        carbs: 28,
        fats: 16,
        confidence: 95,
      });
      toast.success("Food Recognized!");
    }, 1500);
  };

  const handleManualLog = () => {
    logMeal(manualCal, manualProt, manualCarb, manualFat);
    toast.success(`Logged meal: ${manualCal} kcal, ${manualProt}g Protein!`);
  };

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) {
      toast.error("Please enter at least 1 ingredient from your fridge!");
      return;
    }

    setIsGeneratingRecipe(true);
    setGeneratedRecipe(null);

    const ingLower = ingredients.toLowerCase();
    const items = ingredients.split(",").map((i) => i.trim()).filter(Boolean);

    let name = "AI High-Protein Custom Power Bowl";
    let kcal = 420;
    let prot = 32;
    let carbs = 35;
    let fats = 14;
    let time = "15 min";
    let whyFits = "Balanced macronutrient profile customized to optimize recovery and daily calorie targets.";

    if (ingLower.includes("chicken") || ingLower.includes("turkey")) {
      name = `AI ${items[0] || "Chicken"} & Veggie Macro Bowl`;
      kcal = 490;
      prot = 45;
      carbs = 30;
      fats = 12;
      whyFits = "High protein content accelerates muscle protein synthesis after strenuous hypertrophic workouts.";
    } else if (ingLower.includes("egg") || ingLower.includes("oat")) {
      name = `AI ${items[0] || "Egg"} Power Fuel Scramble`;
      kcal = 380;
      prot = 28;
      carbs = 42;
      fats = 14;
      whyFits = "Clean slow-digesting carbohydrates paired with complete egg proteins for sustained energy.";
    } else if (ingLower.includes("fish") || ingLower.includes("salmon") || ingLower.includes("tuna")) {
      name = `AI Omega-3 ${items[0] || "Fish"} Energy Plate`;
      kcal = 460;
      prot = 40;
      carbs = 20;
      fats = 18;
      whyFits = "Rich in essential Omega-3 fatty acids to reduce systemic joint inflammation and speed up recovery.";
    } else if (ingLower.includes("tofu") || ingLower.includes("paneer") || ingLower.includes("lentil")) {
      name = `AI Plant-Based ${items[0] || "Tofu"} Protein Delight`;
      kcal = 410;
      prot = 30;
      carbs = 38;
      fats = 14;
      whyFits = "Plant-derived amino acids and micronutrients ideal for restorative cellular health.";
    } else if (items.length > 0) {
      name = `AI ${items[0].charAt(0).toUpperCase() + items[0].slice(1)} Performance Recipe`;
    }

    const recipeIngredients = items.map((item) => `100g Fresh ${item.charAt(0).toUpperCase() + item.slice(1)}`);
    if (recipeIngredients.length < 3) {
      recipeIngredients.push("1 tbsp Extra Virgin Olive Oil / Seasonings");
    }

    const steps = [
      `Wash and prep your main ingredients (${items.slice(0, 3).join(", ")}).`,
      `Heat 1 tbsp olive oil in a skillet over medium heat. Sauté ${items[0] || "ingredients"} until cooked through (7-9 mins).`,
      `Add remaining ingredients, season with sea salt and black pepper, and serve warm.`,
    ];

    setTimeout(() => {
      setGeneratedRecipe({
        name,
        time,
        kcal,
        protein: prot,
        carbs,
        fats,
        macros: `${prot}g Protein · ${carbs}g Carbs · ${fats}g Fat`,
        ingredients: recipeIngredients,
        steps,
        whyFits,
      });
      setIsGeneratingRecipe(false);
      toast.success(`Generated recipe for ${items.slice(0, 2).join(" & ")}!`);
    }, 1200);
  };

  const startScan = (imageFile?: File) => {
    setShowScanner(true);
    setScanStatus("scanning");
    setScannedFood(null);

    if (imageFile) {
      stopLiveCamera();
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImagePreview(e.target?.result as string);
      reader.readAsDataURL(imageFile);
    } else {
      setUploadedImagePreview(null);
    }

    // AI Recognition simulation
    setTimeout(() => {
      setScanStatus("scanned");
      setScannedFood({
        name: imageFile ? "AI Scanned: Grilled Chicken & Quinoa Bowl" : "Scanned Item: Greek Protein Yogurt",
        kcal: 420,
        protein: 36,
        carbs: 28,
        fats: 10,
        confidence: 96,
      });
      toast.success("Food Recognized Successfully!");
    }, 1800);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startScan(file);
    }
  };

  const handleConfirmScan = () => {
    if (scannedFood) {
      logMeal(scannedFood.kcal, scannedFood.protein, scannedFood.carbs, scannedFood.fats);
      stopLiveCamera();
      setShowScanner(false);
      setScanStatus("idle");
      setUploadedImagePreview(null);
      toast.success(`Logged: ${scannedFood.name}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-app-bg text-white overflow-y-auto no-scrollbar pb-24 px-5 pt-2">
      
      {/* Hidden File Input for Gallery Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="flex justify-between items-center mt-2 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("home")}
            className="w-8.5 h-8.5 flex items-center justify-center text-text-sec hover:text-white cursor-pointer active:scale-90 transition-all"
          >
            <ChevronLeft className="w-5.5 h-5.5 stroke-[2.3]" />
          </button>
          <h2 className="text-[19px] font-extrabold text-white">Daily Nutrition</h2>
        </div>

        {/* Scan Food Action Button */}
        <button
          onClick={startLiveCamera}
          className="px-3 py-1.5 rounded-xl bg-gold/15 border border-gold/30 text-gold hover:text-white cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 text-xs font-extrabold shadow-sm"
        >
          <Camera className="w-4 h-4 stroke-[2.2]" />
          <span>Live Camera</span>
        </button>
      </div>

      {/* Hero Scan Banner Trigger */}
      <div className="bg-gradient-to-r from-amber-500/15 via-gold/10 to-transparent border border-gold/30 rounded-2xl p-4 mb-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gold/20 text-gold flex items-center justify-center border border-gold/40 shrink-0">
            <Camera className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Live AI Food & Barcode Scanner</h3>
            <p className="text-[10.5px] text-[#B0AA9A] mt-0.5">Use live camera stream or upload photo to log macros</p>
          </div>
        </div>

        <button
          onClick={startLiveCamera}
          className="px-3.5 py-2 bg-gold hover:bg-gold-bright text-black font-extrabold text-xs rounded-xl cursor-pointer active:scale-95 transition shadow shrink-0 flex items-center gap-1.5"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Open Camera</span>
        </button>
      </div>

      {/* Macros Visualizer */}
      <div className="bg-app-card border border-white/[0.09] rounded-3xl p-5 mb-4 shadow-sm">
        <span className="text-[12px] font-bold text-text-sec uppercase tracking-wider">Macros Breakdown</span>
        
        {/* Progress tracks */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-bold text-white">
              <span>Calories Consumed</span>
              <span className="text-amber-accent font-extrabold">{Math.round(caloriesToday)} / 2200 kcal</span>
            </div>
            <div className="w-full h-2 bg-app-card2 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (caloriesToday / 2200) * 100)}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3.5 mt-1">
            {/* Protein */}
            <div className="flex flex-col gap-1">
              <span className="text-[9.5px] font-bold text-text-sec uppercase">Protein</span>
              <span className="text-xs font-extrabold text-lime-accent">{proteinToday}g <small className="text-[9.5px] font-normal text-text-sec">/ 120g</small></span>
              <div className="w-full h-1 bg-app-card2 rounded-full overflow-hidden">
                <div className="h-full bg-lime-accent rounded-full" style={{ width: `${Math.min(100, (proteinToday / 120) * 100)}%` }} />
              </div>
            </div>
            {/* Carbs */}
            <div className="flex flex-col gap-1">
              <span className="text-[9.5px] font-bold text-text-sec uppercase">Carbs</span>
              <span className="text-xs font-extrabold text-gold">{carbsToday}g <small className="text-[9.5px] font-normal text-text-sec">/ 250g</small></span>
              <div className="w-full h-1 bg-app-card2 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: `${Math.min(100, (carbsToday / 250) * 100)}%` }} />
              </div>
            </div>
            {/* Fats */}
            <div className="flex flex-col gap-1">
              <span className="text-[9.5px] font-bold text-text-sec uppercase">Fat</span>
              <span className="text-xs font-extrabold text-gold-amber">{fatsToday}g <small className="text-[9.5px] font-normal text-text-sec">/ 70g</small></span>
              <div className="w-full h-1 bg-app-card2 rounded-full overflow-hidden">
                <div className="h-full bg-gold-amber rounded-full" style={{ width: `${Math.min(100, (fatsToday / 70) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Log Meal Logger Form */}
      <h3 className="text-sm font-extrabold tracking-wide text-white mb-2.5 mt-2">Quick Log Meal</h3>
      <div className="bg-app-card border border-white/[0.09] rounded-2xl p-4.5 mb-4 flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9.5px] font-bold text-text-sec uppercase tracking-wider block mb-1">Calories (kcal)</label>
            <input
              type="number"
              value={manualCal}
              onChange={(e) => setManualCal(parseInt(e.target.value) || 0)}
              className="w-full h-9.5 rounded-lg border border-white/5 bg-app-card2 text-white font-bold text-xs px-3 focus:outline-none focus:border-gold/30"
            />
          </div>
          <div>
            <label className="text-[9.5px] font-bold text-text-sec uppercase tracking-wider block mb-1">Protein (g)</label>
            <input
              type="number"
              value={manualProt}
              onChange={(e) => setManualProt(parseInt(e.target.value) || 0)}
              className="w-full h-9.5 rounded-lg border border-white/5 bg-app-card2 text-white font-bold text-xs px-3 focus:outline-none focus:border-gold/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9.5px] font-bold text-text-sec uppercase tracking-wider block mb-1">Carbohydrates (g)</label>
            <input
              type="number"
              value={manualCarb}
              onChange={(e) => setManualCarb(parseInt(e.target.value) || 0)}
              className="w-full h-9.5 rounded-lg border border-white/5 bg-app-card2 text-white font-bold text-xs px-3 focus:outline-none focus:border-gold/30"
            />
          </div>
          <div>
            <label className="text-[9.5px] font-bold text-text-sec uppercase tracking-wider block mb-1">Fats (g)</label>
            <input
              type="number"
              value={manualFat}
              onChange={(e) => setManualFat(parseInt(e.target.value) || 0)}
              className="w-full h-9.5 rounded-lg border border-white/5 bg-app-card2 text-white font-bold text-xs px-3 focus:outline-none focus:border-gold/30"
            />
          </div>
        </div>

        <button
          onClick={handleManualLog}
          className="w-full h-11 bg-gold text-black font-extrabold text-xs cursor-pointer shadow rounded-xl hover:bg-gold/90 active:scale-97 transition-all mt-1"
        >
          Add Meal to Diary
        </button>
      </div>

      {/* AI Recipe Generator Section */}
      <h3 className="text-sm font-extrabold tracking-wide text-white mb-2.5 mt-2">AI Recipe Generator</h3>
      <div className="bg-app-card border border-white/[0.09] rounded-2xl p-4.5 mb-4 flex flex-col gap-3.5">
        <div>
          <label className="text-[9.5px] font-bold text-text-sec uppercase tracking-wider block mb-1.5">What is in your fridge?</label>
          <textarea
            rows={2}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="E.g. chicken, eggs, rice, broccoli"
            className="w-full rounded-xl border border-white/5 bg-app-card2 text-white font-medium text-xs p-3 focus:outline-none focus:border-gold/30 resize-none leading-relaxed"
          />
        </div>

        <button
          onClick={handleGenerateRecipe}
          disabled={isGeneratingRecipe}
          className="w-full h-11 bg-gold-gradient text-white font-extrabold text-xs cursor-pointer shadow rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50 transition-all"
        >
          {isGeneratingRecipe ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Ingredients...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Generate FitAI Recipe</span>
            </>
          )}
        </button>

        {/* Recipe Display */}
        <AnimatePresence>
          {generatedRecipe && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3.5 border-t border-white/5 flex flex-col gap-3"
            >
              <div>
                <span className="text-[10px] text-gold font-extrabold uppercase tracking-wide">AI Recommendation</span>
                <h4 className="text-[14px] font-extrabold text-white mt-0.5 leading-tight">{generatedRecipe.name}</h4>
                <div className="flex gap-2.5 text-[9.5px] font-semibold text-text-sec mt-1 bg-app-card2 px-2.5 py-1 rounded-md border border-white/5 width-fit">
                  <span>⏲️ {generatedRecipe.time}</span>
                  <span>🔥 {generatedRecipe.kcal} kcal</span>
                </div>
              </div>

              <div className="text-[10px] text-gold-pale bg-gold/10 p-2.5 border border-gold/20 rounded-xl leading-relaxed font-semibold">
                {generatedRecipe.whyFits}
              </div>

              <div>
                <h5 className="text-[10px] font-bold text-text-sec uppercase tracking-wider mb-1">Ingredients</h5>
                <ul className="list-disc pl-4 text-xs text-text-sec leading-relaxed">
                  {generatedRecipe.ingredients.map((ing: string, i: number) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-[10px] font-bold text-text-sec uppercase tracking-wider mb-1">Preparation</h5>
                <ol className="list-decimal pl-4 text-xs text-text-sec leading-relaxed flex flex-col gap-1.5">
                  {generatedRecipe.steps.map((st: string, i: number) => (
                    <li key={i}>{st}</li>
                  ))}
                </ol>
              </div>

              <button
                onClick={() => {
                  logMeal(
                    generatedRecipe.kcal,
                    generatedRecipe.protein || 35,
                    generatedRecipe.carbs || 25,
                    generatedRecipe.fats || 12
                  );
                  toast.success(`Logged ${generatedRecipe.name}!`);
                  setGeneratedRecipe(null);
                }}
                className="w-full h-10 bg-white/5 border border-white/[0.08] hover:bg-white/10 rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1 active:scale-95 transition-all mt-1"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Log Recipe Intake</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live Camera / Barcode Scanner Modal Overlay */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col justify-between p-6 overflow-hidden"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center mt-4 z-20">
              <div>
                <span className="text-[10px] text-gold font-extrabold uppercase tracking-widest block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping inline-block" /> Live Vision
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">Live Camera Food Scanner</h3>
              </div>
              <button
                onClick={() => {
                  stopLiveCamera();
                  setShowScanner(false);
                  setScanStatus("idle");
                  setUploadedImagePreview(null);
                }}
                className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center cursor-pointer active:scale-90 transition-all"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Viewfinder Frame */}
            <div className="flex-1 flex flex-col items-center justify-center my-3 relative z-10">
              <div className="relative w-72 h-72 border-2 border-dashed border-gold/70 rounded-3xl flex items-center justify-center overflow-hidden bg-black/80 shadow-2xl shadow-gold/10">
                
                {/* 1. Live Camera Stream View */}
                {isCameraActive && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-3xl"
                  />
                )}

                {/* 2. Uploaded / Captured Image Preview */}
                {!isCameraActive && uploadedImagePreview && (
                  <img
                    src={uploadedImagePreview}
                    alt="Captured food preview"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* 3. Fallback Viewfinder HUD */}
                {!isCameraActive && !uploadedImagePreview && (
                  <div className="text-center p-6 text-text-sec z-0 flex flex-col items-center gap-3">
                    {scanStatus === "scanning" ? (
                      <>
                        <Camera className="w-10 h-10 text-gold animate-bounce" />
                        <span className="text-xs font-bold text-white tracking-wide">Analyzing Image & Barcode...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-12 h-12 text-lime-accent stroke-[3]" />
                        <span className="text-xs font-bold text-white tracking-wide">Recognition Ready!</span>
                      </>
                    )}
                  </div>
                )}

                {/* Laser animation */}
                {scanStatus === "scanning" && (
                  <motion.div
                    animate={{ y: [-140, 140] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gold/90 shadow-[0_0_20px_#F5C400] z-20"
                  />
                )}
              </div>

              {/* Viewfinder Control Bar */}
              <div className="flex gap-3 mt-4">
                {isCameraActive ? (
                  <button
                    onClick={capturePhotoFromCamera}
                    className="px-6 py-2.5 bg-gold text-black font-extrabold text-xs rounded-full shadow-lg cursor-pointer active:scale-95 transition flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Photo</span>
                  </button>
                ) : (
                  <button
                    onClick={startLiveCamera}
                    className="px-5 py-2 bg-gold/20 border border-gold/40 text-gold font-extrabold text-xs rounded-full cursor-pointer active:scale-95 transition flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Re-open Camera</span>
                  </button>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white/10 border border-white/10 text-white font-bold text-xs rounded-full cursor-pointer hover:bg-white/15 active:scale-95 transition flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose File</span>
                </button>
              </div>
            </div>

            {/* Scanned fact results sheet */}
            <div className="mb-4 z-20">
              {scanStatus === "scanned" && scannedFood && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-[#161616] border border-white/10 rounded-2xl p-4.5 flex flex-col gap-3.5 shadow-2xl"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-gold font-extrabold uppercase tracking-wide">Food Recognized ({scannedFood.confidence}%)</span>
                      <h4 className="text-base font-extrabold text-white mt-0.5 leading-tight">{scannedFood.name}</h4>
                    </div>
                  </div>
                  
                  {/* Macros editable breakdown */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold bg-black/50 p-3 border border-white/5 rounded-xl">
                    <div>
                      <input
                        type="number"
                        value={scannedFood.kcal}
                        onChange={(e) => setScannedFood({ ...scannedFood, kcal: Number(e.target.value) })}
                        className="w-full bg-transparent text-center font-extrabold text-white text-sm outline-none border-b border-white/20 focus:border-gold"
                      />
                      <span className="text-[9.5px] text-[#B0AA9A] font-semibold mt-0.5 block">kcal</span>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={scannedFood.protein}
                        onChange={(e) => setScannedFood({ ...scannedFood, protein: Number(e.target.value) })}
                        className="w-full bg-transparent text-center font-extrabold text-lime-accent text-sm outline-none border-b border-white/20 focus:border-gold"
                      />
                      <span className="text-[9.5px] text-[#B0AA9A] font-semibold mt-0.5 block">Prot (g)</span>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={scannedFood.carbs}
                        onChange={(e) => setScannedFood({ ...scannedFood, carbs: Number(e.target.value) })}
                        className="w-full bg-transparent text-center font-extrabold text-gold text-sm outline-none border-b border-white/20 focus:border-gold"
                      />
                      <span className="text-[9.5px] text-[#B0AA9A] font-semibold mt-0.5 block">Carb (g)</span>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={scannedFood.fats}
                        onChange={(e) => setScannedFood({ ...scannedFood, fats: Number(e.target.value) })}
                        className="w-full bg-transparent text-center font-extrabold text-gold-amber text-sm outline-none border-b border-white/20 focus:border-gold"
                      />
                      <span className="text-[9.5px] text-[#B0AA9A] font-semibold mt-0.5 block">Fat (g)</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleConfirmScan}
                      className="flex-1 h-12 bg-gold text-black font-extrabold text-xs cursor-pointer shadow rounded-xl active:scale-95 transition-all uppercase tracking-wider"
                    >
                      Log Scanned Item
                    </button>
                    <button
                      onClick={() => {
                        stopLiveCamera();
                        setShowScanner(false);
                        setScanStatus("idle");
                        setUploadedImagePreview(null);
                      }}
                      className="flex-1 h-12 bg-white/5 border border-white/10 text-white font-bold text-xs cursor-pointer rounded-xl hover:bg-white/10 active:scale-95 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};
