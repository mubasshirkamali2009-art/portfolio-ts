"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  SiTypescript, SiJavascript, SiReact, SiNextdotjs, 
  SiNodedotjs, SiExpress, SiMongodb, SiJsonwebtokens, 
  SiTailwindcss, SiFirebase, SiPrisma, SiRedux,
  SiPostgresql, SiHtml5, SiPython, SiPhp
} from "react-icons/si";
import { LuLayoutDashboard, LuCode } from "react-icons/lu";

// আইকন অবজেক্ট বাইন্ডিং
const ICON_MAP: Record<string, React.ReactNode> = {
  typescript: <SiTypescript />,
  javascript: <SiJavascript />,
  react: <SiReact />,
  nextjs: <SiNextdotjs />,
  node: <SiNodedotjs />,
  express: <SiExpress />,
  mongodb: <SiMongodb />,
  jwt: <SiJsonwebtokens />,
  tailwind: <SiTailwindcss />,
  recharts: <LuLayoutDashboard />,
  firebase: <SiFirebase />,
  prisma: <SiPrisma />,
  redux: <SiRedux />,
  postgresql: <SiPostgresql />,
  html5: <SiHtml5 />,
  python: <SiPython />,
  php: <SiPhp />,
  generic: <LuCode />
};

interface Skill {
  name: string;
  iconKey: string;
  percentage: number;
  color: string;
  glowColor: string;
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("/api/skills");
        const data = await res.json();
        if (data.success) {
          setSkills(data.skills);
        }
      } catch (err) {
        console.error("Error loading component data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto my-8 p-12 text-center text-slate-500 animate-pulse bg-[#0B0F19]/40 border border-slate-900 rounded-3xl h-64 flex items-center justify-center">
        Analyzing tech stack data from repository...
      </div>
    );
  }

  return (
    <section className="w-full max-w-6xl bg-[#0B0F19] border border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-2xl mx-auto my-8 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="mb-8 relative z-10">
        <h2 className="text-xl font-bold text-white tracking-tight">Skills</h2>
        <p className="text-xs text-slate-400 mt-1">
          Dynamic project usage frequency across your live database
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative z-10">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            whileHover={{ y: -4 }}
            className={`group relative bg-[#111726]/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${skill.glowColor} overflow-hidden`}
          >
            {/* React Icon */}
            <div className="p-3 bg-[#131B2E] rounded-xl text-slate-300 text-xl border border-slate-800 group-hover:scale-110 group-hover:text-white transition-all duration-300">
              {ICON_MAP[skill.iconKey] || ICON_MAP.generic}
            </div>

            {/* Name */}
            <span className="text-xs font-semibold text-slate-300 tracking-wide text-center truncate w-full">
              {skill.name}
            </span>

            {/* Percentage Text */}
            <span className="text-sm font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white">
              {skill.percentage}%
            </span>

            {/* Progress Bar Animation */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-800/60 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}