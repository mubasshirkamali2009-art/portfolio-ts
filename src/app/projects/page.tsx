"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Loader2, ArrowUpRight, Star } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  images: string[];
  category?: string;
  averageRating?: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        
        console.log("API Response Data:", data);

        if (data && data.success && Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else if (Array.isArray(data)) {
          setProjects(data);
        } else if (data && Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else if (data && Array.isArray(data.data)) {
          setProjects(data.data);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []); // এখানে সিনট্যাক্স এররটি ফিক্স করা হয়েছে

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a10]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-[#0a0a10] px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Explore Our <span className="text-indigo-500">Projects</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base text-slate-400"
          >
            Innovative ideas crafted into reality. Click on any card to view detailed specifications.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {projects.map((project) => (
            <Link key={project._id} href={`/projects/${project._id}`}>
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f18] p-4 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
                  <img
                    src={project.images?.[0] || "/placeholder.png"}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {project.category && (
                    <span className="absolute left-2 top-2 rounded-md bg-indigo-600/90 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                      {project.category}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-white transition group-hover:text-indigo-400">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-400" />
                  </div>
                  
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                    {project.shortDescription}
                  </p>

                  <div className="mt-auto pt-4 flex items-center gap-1.5 text-xs text-slate-500">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-semibold text-slate-300">
                      {project.averageRating || "0.0"}
                    </span>
                    <span>Rating</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {projects.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No projects found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}