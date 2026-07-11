"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ১. ছবিগুলো ইম্পোর্ট করা হলো (পাথ এবং বানান ঠিক রেখে)
import boyBoardImg from "../resourece/boyboard.png";
import boyJoyImg from "../resourece/ChatGPT Image Jul 12, 2026, 01_39_35 AM.png";
import boyThinkImg from "../resourece/boyjoy.png";

export default function DeveloperLife() {
  const [mood, setMood] = useState<"bored" | "solving" | "resolved">("bored");
  const [coffeeCount, setCoffeeCount] = useState(4);

  const moodConfig = {
    bored: {
      emoji: "🥱",
      status: "Feeling Bored & Stuck",
      desc: "Staring at the screen, scrolling through code loops, fighting bugs that don't make sense.",
      bg: "bg-red-950/20 border-red-900/40 text-red-400",
      quote: '"Why is this undefined? It was working 5 minutes ago..."',
      image: boyBoardImg 
    },
    solving: {
      emoji: "🧠",
      status: "Deep in the Zone",
      desc: "Analyzing runtime logs, refactoring architecture patterns, and consuming caffeine.",
      bg: "bg-amber-950/20 border-amber-900/40 text-amber-400",
      quote: '"Debugging is 80% of the job, and most of my ideas show up at 2 AM."',
      image: boyThinkImg 
    },
    resolved: {
      emoji: "🚀",
      status: "Bug Resolved! Pure Dopamine",
      desc: "Everything compiles smoothly. Production deployment runs perfectly. Absolute relief.",
      bg: "bg-emerald-950/20 border-emerald-900/40 text-emerald-400",
      quote: '"It works! I am a wizard. Don\'t touch anything anymore."',
      image: boyJoyImg 
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto my-12 p-6 md:p-8 bg-[#0B0F19]/60 border border-slate-800/80 rounded-3xl text-white">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Developer Life</h2>
          <p className="text-xs text-slate-400 mt-0.5">A day behind the monitor</p>
        </div>
        
        {/* Interactive Mode Controls */}
        <div className="flex bg-[#111726] p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
          <button 
            type="button"
            onClick={() => setMood("bored")} 
            className={`px-3 py-1.5 rounded-lg transition-all ${mood === "bored" ? "bg-red-600 font-medium text-white" : "text-slate-400"}`}
          >
            Boredom
          </button>
          <button 
            type="button"
            onClick={() => setMood("solving")} 
            className={`px-3 py-1.5 rounded-lg transition-all ${mood === "solving" ? "bg-amber-600 font-medium text-white" : "text-slate-400"}`}
          >
            Solving
          </button>
          <button 
            type="button"
            onClick={() => setMood("resolved")} 
            className={`px-3 py-1.5 rounded-lg transition-all ${mood === "resolved" ? "bg-emerald-600 font-medium text-white" : "text-slate-400"}`}
          >
            Success
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Main Interactive Board Container */}
        <div className={`md:col-span-3 flex flex-col justify-between p-6 rounded-2xl bg-[#111726]/40 border min-h-[260px] transition-all duration-300 relative overflow-hidden ${moodConfig[mood].bg.split(" ")[0]} ${moodConfig[mood].bg.split(" ")[1]}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mood}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              // sm/মোবাইলে কন্টেন্ট উপর-নিচে (flex-col) এবং সেন্টারে থাকবে, বড় স্ক্রিনে পাশাপাশি (sm:flex-row) এলাইন হবে
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 w-full h-full items-center sm:items-stretch"
            >
              {/* Text Area - সেন্টারিং করার জন্য মোবাইল লেআউটে text-center এবং items-center অ্যাড করা হয়েছে */}
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-3 flex-1 pb-2">
                <span className="text-3xl sm:mt-0.5">{moodConfig[mood].emoji}</span>
                <div>
                  <h4 className={`font-semibold ${moodConfig[mood].bg.split(" ")[2]}`}>{moodConfig[mood].status}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{moodConfig[mood].desc}</p>
                </div>
              </div>

              {/* Fixed Layout: মোবাইলে সেন্টারে থাকবে (mx-auto), বড় স্ক্রিনে ডানে এবং নিচে ফিক্সড হবে */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden bg-slate-900/40 border border-slate-800/50 flex-shrink-0 mx-auto sm:mx-0 sm:self-end">
                <Image
                  src={moodConfig[mood].image}
                  alt={moodConfig[mood].status}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* কোটেশন টেক্সটও মোবাইলে সেন্টারড দেখাবে */}
          <p className="text-xs italic text-slate-400 border-l-2 sm:border-l-2 border-slate-700 pl-3 mt-6 text-center sm:text-left">
            {moodConfig[mood].quote}
          </p>
        </div>

        {/* Static/Interactive Metrics Side Panel */}
        <div className="md:col-span-2 flex flex-col gap-3 justify-center">
          <div 
            onClick={() => setCoffeeCount(prev => prev + 1)}
            className="p-3 bg-[#111726]/70 border border-slate-800/80 rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-500/30 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base group-hover:animate-bounce">☕</span>
              <span className="text-xs font-medium text-slate-300">Minimum Refills</span>
            </div>
            <span className="text-xs font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md">
              {coffeeCount} coffees
            </span>
          </div>

          <div className="p-3 bg-[#111726]/70 border border-slate-800/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span>🪲</span>
              <span className="text-xs font-medium text-slate-300">Debugging State</span>
            </div>
            <span className="text-xs font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md">
              80% of the job
            </span>
          </div>

          <div className="p-3 bg-[#111726]/70 border border-slate-800/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span>🌙</span>
              <span className="text-xs font-medium text-slate-300">Working Routine</span>
            </div>
            <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md">
              Ships after midnight
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}