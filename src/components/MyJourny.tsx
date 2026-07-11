"use client";

import { motion } from "framer-motion";

interface JourneyItem {
  duration: string;
  title: string;
  description: string;
  color: string;
}

export default function MyJourney() {
  const journeyData: JourneyItem[] = [
    {
      duration: "Jan — Feb 2026",
      title: "Web Foundations & Responsive Design",
      description: "Started the journey with semantic HTML5, CSS3 layout techniques, and responsive styling patterns using Tailwind CSS.",
      color: "#3B82F6", // Blue
    },
    {
      duration: "Mar — Apr 2026",
      title: "JavaScript & React Fundamentals",
      description: "Mastered core JavaScript, DOM manipulation, asynchronous programming, and transitioned into declarative component architectures with React.",
      color: "#6366F1", // Indigo
    },
    {
      duration: "May 2026",
      title: "Advanced React & Next.js Transition",
      description: "Explored state compilation, complex hooks, context APIs, and stepped into server-side performance optimization with Next.js.",
      color: "#8B5CF6", // Purple
    },
    {
      duration: "June 2026",
      title: "Backend Core & Database Integration",
      description: "Connected databases, wrote scalable Next.js API route handlers, configured MongoDB schemas, and handled state synchronization safely.",
      color: "#F59E0B", // Amber
    },
    {
      duration: "July 2026",
      title: "Full Stack Deployment & Vibe Coding",
      description: "Assembling analytical stats tracking, real-time metrics generation, and deploying the complete portfolio ecosystem to cloud networks.",
      color: "#10B981", // Emerald
    },
  ];

  return (
    // এই কন্টেইনারের উইডথ, প্যাডিং ও বর্ডার এখন অবিকল Stats সেকশনের সমান
    <section className="w-full max-w-6xl mx-auto my-12 p-6 md:p-8 bg-[#0B0F19]/60 border border-slate-800/80 rounded-3xl text-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">My Journey</h2>
        <p className="text-xs text-slate-400 mt-0.5">Real-time learning timeline and milestone history</p>
      </div>

      {/* কন্টেইনার সাইজ ফিক্সড করার জন্য পারফেক্ট রিলেটিভ উইডথ লেআউট */}
      <div className="relative w-full pl-6 border-l border-slate-800/60 space-y-10">
        {journeyData.map((item, index) => (
          <motion.div
            key={item.duration}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative w-full"
          >
            {/* Timeline Indicator Dot - এলাইনমেন্ট এবং লেফট পজিশন পারফেক্ট করা হয়েছে */}
            <div
              className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-4 border-[#0B0F19] transition-all duration-300 hover:scale-125 z-10"
              style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}
            />
            
            {/* Metadata Text blocks */}
            <div className="w-full">
              <span className="text-xs font-bold uppercase tracking-wider block mb-0.5" style={{ color: item.color }}>
                {item.duration}
              </span>
              <h3 className="text-lg font-semibold text-slate-200">{item.title}</h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed max-w-3xl">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}