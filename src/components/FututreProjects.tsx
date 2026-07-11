"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ImageIcon, ArrowUpRight, Sparkles, FolderOpen } from "lucide-react";

interface FeaturedProject {
  _id: any;
  title: string;
  shortDescription: string;
  category: string;
  techStack: string[];
  images?: string[];
  featured?: boolean;
}

function getSafeId(idObj: any): string {
  if (!idObj) return "";
  if (typeof idObj === "string") return idObj;
  if (idObj.$oid) return idObj.$oid;
  if (idObj.toString) return idObj.toString();
  return String(idObj);
}

// ---------------------------------------------------------------------------
// Loading spinner — layered rings + pulsing core, matches the purple/indigo theme
// ---------------------------------------------------------------------------
function FeaturedProjectsSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24">
      <div className="relative h-16 w-16">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-indigo-500/60"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute inset-1.5 rounded-full border-2 border-transparent border-b-purple-500 border-l-purple-500/60"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute inset-[10px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"
          animate={{ scale: [1, 0.75, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.p
        className="text-sm font-medium tracking-wide text-neutral-400"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading featured projects...
      </motion.p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state — shown when there are no featured projects
// ---------------------------------------------------------------------------
function NoFeaturedProjects() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 py-24 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900">
        <FolderOpen className="h-7 w-7 text-neutral-600" />
      </div>
      <div>
        <p className="font-medium text-neutral-300">No highlighted projects yet</p>
        <p className="mt-1 text-sm text-neutral-500">Check back soon for featured work.</p>
      </div>
    </motion.div>
  );
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success) {
          const featured = (data.projects || []).filter(
            (p: FeaturedProject) => p.featured
          );
          setProjects(featured);
        }
      } catch (err) {
        console.error("Error fetching featured projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return (
    <section className="relative w-full px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-10 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" />
              Featured
            </div>
            <h2 className="bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
              Highlighted Projects
            </h2>
          </div>

          <Link
            href="/projects"
            className="group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
          >
            View all projects
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <FeaturedProjectsSpinner />
        ) : projects.length === 0 ? (
          <NoFeaturedProjects />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => {
              const id = getSafeId(project._id);
              const thumbnail = project.images?.[0];

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.08, ease: "easeOut" }}
                >
                  <Link
                    href={`/projects/${id}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-900/40 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-neutral-700 hover:shadow-2xl hover:shadow-purple-500/10"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-neutral-700" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />

                      <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
                        <Star className="h-3 w-3" fill="currentColor" />
                        Featured
                      </span>

                      <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-neutral-950/60 text-neutral-300 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <div>
                        <h3 className="line-clamp-1 text-lg font-bold text-white transition-colors duration-300 group-hover:text-indigo-300">
                          {project.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
                          {project.shortDescription}
                        </p>
                      </div>

                      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                        {project.techStack?.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-xs text-neutral-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack && project.techStack.length > 3 && (
                          <span className="rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-xs text-neutral-500">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}