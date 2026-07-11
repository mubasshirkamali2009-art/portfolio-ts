import { NextResponse } from "next/server";
import { db } from "@/lib/auth";

const SKILL_THEMES: Record<string, { label: string; iconKey: string; color: string; glow: string }> = {
  "typescript": { label: "TypeScript", iconKey: "typescript", color: "from-blue-500 to-indigo-500", glow: "hover:border-blue-500/30" },
  "javascript": { label: "JavaScript", iconKey: "javascript", color: "from-yellow-400 to-amber-500", glow: "hover:border-yellow-500/30" },
  "react": { label: "React", iconKey: "react", color: "from-cyan-400 to-blue-500", glow: "hover:border-cyan-500/30" },
  "next.js": { label: "Next.js", iconKey: "nextjs", color: "from-slate-200 to-slate-500", glow: "hover:border-white/20" },
  "node.js": { label: "Node.js", iconKey: "node", color: "from-green-400 to-emerald-500", glow: "hover:border-green-500/30" },
  "express": { label: "Express.js", iconKey: "express", color: "from-slate-400 to-slate-600", glow: "hover:border-slate-500/30" },
  "mongodb": { label: "MongoDB", iconKey: "mongodb", color: "from-amber-500 to-orange-500", glow: "hover:border-amber-500/30" },
  "jwt": { label: "JWT Auth", iconKey: "jwt", color: "from-purple-500 to-indigo-600", glow: "hover:border-purple-500/30" },
  "tailwind css": { label: "Tailwind CSS", iconKey: "tailwind", color: "from-sky-400 to-teal-500", glow: "hover:border-sky-400/30" },
  "recharts": { label: "Recharts", iconKey: "recharts", color: "from-purple-500 to-pink-500", glow: "hover:border-purple-500/30" },
  "firebase": { label: "Firebase", iconKey: "firebase", color: "from-amber-400 to-orange-500", glow: "hover:border-amber-500/30" },
  "prisma": { label: "Prisma ORM", iconKey: "prisma", color: "from-blue-600 to-teal-500", glow: "hover:border-blue-400/30" },
  "redux": { label: "Redux", iconKey: "redux", color: "from-purple-600 to-indigo-500", glow: "hover:border-purple-500/30" },
  "postgresql": { label: "PostgreSQL", iconKey: "postgresql", color: "from-blue-400 to-indigo-600", glow: "hover:border-blue-500/30" },
  "html5": { label: "HTML5", iconKey: "html5", color: "from-orange-500 to-red-500", glow: "hover:border-orange-500/30" },
  "python": { label: "Python", iconKey: "python", color: "from-blue-500 to-yellow-500", glow: "hover:border-yellow-500/20" },
  "php": { label: "PHP", iconKey: "php", color: "from-indigo-400 to-purple-600", glow: "hover:border-indigo-400/30" }
};

interface CalculatedSkill {
  name: string;
  iconKey: string;
  percentage: number;
  color: string;
  glowColor: string;
  count: number;
}

export async function GET() {
  try {
    const projectsCollection = db.collection("projectscollection");
    const projects = await projectsCollection.find({}).toArray();

    const totalProjects = projects.length;
    const techCounts: Record<string, number> = {};

    // ১. ডাটাবেজের প্রজেক্টগুলোর techStack ফিল্ড চেক করা হচ্ছে
    projects.forEach((project) => {
      if (Array.isArray(project.techStack)) {
        project.techStack.forEach((tech: string) => {
          if (tech) {
            const formattedTech = tech.toLowerCase().trim();
            techCounts[formattedTech] = (techCounts[formattedTech] || 0) + 1;
          }
        });
      }
    });

    // ২. শুধুমাত্র যে টেকনোলজিগুলোর কাউন্ট > ০, সেগুলোর রিয়েল পার্সেন্টেজ হিসাব করা হচ্ছে
    const computedSkills: CalculatedSkill[] = Object.keys(techCounts).map((tech) => {
      const count = techCounts[tech];
      
      // ডাইনামিক পার্সেন্টেজ ক্যালকুলেশন (কমপক্ষে ১টি প্রজেক্টে থাকলে সর্বনিম্ন ১% নিশ্চিত করবে)
      let percentage = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0;
      if (count > 0 && percentage === 0) {
        percentage = 1; 
      }
      
      const theme = SKILL_THEMES[tech] || {
        label: tech.charAt(0).toUpperCase() + tech.slice(1), 
        iconKey: "generic",
        color: "from-slate-500 to-zinc-600",
        glow: "hover:border-slate-500/20"
      };

      return {
        name: theme.label,
        iconKey: theme.iconKey,
        percentage: percentage,
        color: theme.color,
        glowColor: theme.glow,
        count: count
      };
    });

    // ৩. অবব্যবহৃত (০%) স্কিলগুলো বাদ দিয়ে শুধুমাত্র রিয়েল ব্যবহৃত স্কিলগুলো ফিল্টার করা হলো
    const finalSkills = computedSkills.filter(skill => skill.count > 0);

    // ৪. পার্সেন্টেজ অনুযায়ী বড় থেকে ছোট ক্রমানুসারে সাজানো
    finalSkills.sort((a, b) => b.percentage - a.percentage);

    return NextResponse.json({ success: true, totalProjects, skills: finalSkills });
  } catch (error) {
    console.error("Skills data error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}