"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  SiTypescript, 
  SiReact, 
  SiNodedotjs, 
  SiMongodb 
} from "react-icons/si";

const MotionLink = motion.create(Link);

export default function Hero() {
  const floatAnimation = (delay: number) => ({
    animate: { y: [0, -10, 0] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay } as const
  });

  return (
    /* Changed max-w-5xl to max-w-6xl (or remove max-w entirely to match container width) */
    <section className="relative w-full max-w-6xl min-h-[550px] bg-[#0B0F19] flex flex-col items-center justify-center text-center px-6 overflow-hidden border border-slate-800/60 rounded-3xl shadow-2xl mx-auto my-8">
      
      
      {/* Overlay Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

      {/* Glowing Gradient Blobs */}
      <div className="absolute top-8 left-8 w-72 h-72 bg-blue-600/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-80 h-80 bg-orange-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Floating Animated Tech Icons */}
      <motion.div {...floatAnimation(0)} className="absolute top-14 left-[10%] p-3 bg-[#111726]/90 border border-slate-800 rounded-xl text-cyan-400 text-2xl backdrop-blur-sm hidden sm:block shadow-md">
        <SiReact />
      </motion.div>

      <motion.div {...floatAnimation(1)} className="absolute bottom-24 left-[8%] p-3 bg-[#111726]/90 border border-slate-800 rounded-xl text-blue-500 text-xl backdrop-blur-sm hidden md:block shadow-md">
        <SiNodedotjs />
      </motion.div>

      <motion.div {...floatAnimation(0.5)} className="absolute top-24 right-[10%] p-3 bg-[#111726]/90 border border-slate-800 rounded-xl text-blue-400 text-xl backdrop-blur-sm hidden sm:block shadow-md">
        <SiTypescript />
      </motion.div>

      <motion.div {...floatAnimation(1.5)} className="absolute bottom-32 right-[8%] p-3 bg-[#111726]/90 border border-slate-800 rounded-xl text-amber-500 text-lg backdrop-blur-sm hidden md:block shadow-md">
        <SiMongodb />
      </motion.div>

      {/* Main Copy/Content Area */}
      <div className="relative z-10 flex flex-col items-center max-w-xl pb-12">
        {/* Pulsing Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131B2E] border border-slate-800 text-xs font-medium text-slate-300 mb-6 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Available for work
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
          Hi, Im a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Full Stack Developer</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-slate-400 text-sm sm:text-base mb-8 max-w-md leading-relaxed">
          Building clean, production-ready web applications with modern tools
        </p>

        {/* Animated Link Button */}
        <MotionLink
          href="/projects"
          whileHover={{ scale: 1.06, backgroundColor: "#5046e6" }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 350, damping: 14 }}
          className="px-8 py-3 bg-[#4F46E5] text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 cursor-pointer text-sm border border-indigo-500/20 transition-colors duration-200"
        >
          View my work
        </MotionLink>
      </div>

      {/* Bottom Tech Ticker Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[#080C14]/90 border-t border-slate-900/60 py-3 overflow-hidden">
        <div className="flex justify-center items-center gap-8 text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
          <span>MONGODB</span>
          <span>RECHARTS</span>
          <span>NEXT.JS</span>
          <span>TYPESCRIPT</span>
          <span>TAILWIND</span>
        </div>
      </div>
    </section>
  );
}