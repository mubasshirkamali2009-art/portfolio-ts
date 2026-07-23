"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiMongodb
} from "react-icons/si";
import { ArrowUpRight, ChevronDown, User } from "lucide-react";
import rooftopImg from "@/resourece/rooftop-restorent.jpeg";

const MotionLink = motion.create(Link);

export default function Hero() {
  const floatAnimation = (delay: number) => ({
    animate: { y: [0, -10, 0] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay } as const
  });

  return (
    <section className="relative w-full max-w-6xl min-h-[380px] sm:min-h-[420px] md:min-h-[460px] lg:min-h-[500px] bg-[#0A0D14] flex flex-col items-center justify-between text-left overflow-hidden rounded-3xl border border-slate-800/50 shadow-2xl mx-auto my-4 sm:my-8">

      {/* Floating Animated Tech Icons */}
      <motion.div {...floatAnimation(0)} className="absolute top-10 left-[4%] p-2.5 bg-[#111726]/80 border border-slate-800/80 rounded-xl text-cyan-400 text-xl backdrop-blur-sm hidden xl:block shadow-md z-20">
        <SiReact />
      </motion.div>

      <motion.div {...floatAnimation(1)} className="absolute bottom-20 left-[4%] p-2.5 bg-[#111726]/80 border border-slate-800/80 rounded-xl text-blue-500 text-lg backdrop-blur-sm hidden xl:block shadow-md z-20">
        <SiNodedotjs />
      </motion.div>

      <motion.div {...floatAnimation(0.5)} className="absolute top-10 right-[4%] p-2.5 bg-[#111726]/80 border border-slate-800/80 rounded-xl text-blue-400 text-lg backdrop-blur-sm hidden xl:block shadow-md z-20">
        <SiTypescript />
      </motion.div>

      <motion.div {...floatAnimation(1.5)} className="absolute bottom-20 right-[4%] p-2.5 bg-[#111726]/80 border border-slate-800/80 rounded-xl text-amber-500 text-base backdrop-blur-sm hidden xl:block shadow-md z-20">
        <SiMongodb />
      </motion.div>

      {/* Main Container */}
      <div className="relative w-full flex flex-col md:flex-row items-center justify-between z-10 flex-1">
        
        {/* LEFT — Copy & Buttons */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col items-start justify-center z-10"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827]/80 border border-slate-800 text-xs font-medium text-slate-300 mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for work
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.15]">
            Hello, I’m{" "}
            <span className="text-blue-500 font-extrabold">
              Mubasshir
            </span>
            <br />
            a Full Stack Developer
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm sm:text-base mb-8 max-w-md leading-relaxed">
            Building clean, production-ready web applications with modern tools and technologies.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <MotionLink
              href="/about"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4338CA] hover:bg-[#3730A3] text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-600/30 border border-indigo-400/20 transition-all duration-200"
            >
              <User size={16} />
              More About Me
            </MotionLink>

            <MotionLink
              href="/projects"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0D121F]/80 hover:bg-[#151D30] text-slate-200 text-sm font-medium rounded-xl border border-slate-800 transition-all duration-200"
            >
              My Projects
              <ArrowUpRight size={16} />
            </MotionLink>
          </div>
        </motion.div>

        {/* RIGHT — Reference-Style Blended Profile Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 relative min-h-[300px] sm:min-h-[400px] md:min-h-full h-full flex items-center justify-end"
        >
          {/* Soft Dark Gradients for Smooth Seamless Blending */}
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#0A0D14] via-[#0A0D14]/80 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#0A0D14] to-transparent z-10 md:hidden" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0A0D14] to-transparent z-10" />

          {/* User / Rooftop Photo */}
          <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] lg:h-[540px]">
            <Image
              src={rooftopImg}
              alt="Mubasshir Profile"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center md:object-right"
            />
          </div>
        </motion.div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-20 pb-4 pt-2 flex flex-col items-center gap-1 text-slate-500 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-5 border border-slate-600 rounded-full flex justify-center pt-1">
            <span className="w-1 h-1.5 bg-slate-400 rounded-full animate-bounce" />
          </span>
          <span>Scroll down</span>
        </div>
        <ChevronDown size={14} className="text-slate-500 animate-pulse" />
      </div>

    </section>
  );
}