// src/app/projects/manage/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import {
  Star,
  Pencil,
  Trash2,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Sparkles,
  Boxes,
  Code2,
  ImageIcon,
  Layers,
  X,
} from "lucide-react";

interface ManagedProject {
  _id: any;
  title: string;
  shortDescription: string;
  category: string;
  hours: number;
  techStack: string[];
  images?: string[];
  featured?: boolean;
  liveLink?: string;
  githubLink?: string;
}

function getSafeId(idObj: any): string {
  if (!idObj) return "";
  if (typeof idObj === "string") return idObj;
  if (idObj.$oid) return idObj.$oid;
  if (idObj.toString) return idObj.toString();
  return String(idObj);
}

// ---------------------------------------------------------------------------
// Decorative floating background icons — purely visual, non-interactive
// ---------------------------------------------------------------------------
function FloatingIcons() {
  const items = [
    { Icon: Sparkles, top: "8%", left: "6%", size: 28, duration: 6, delay: 0, color: "text-purple-500/20" },
    { Icon: Boxes, top: "18%", left: "88%", size: 34, duration: 7.5, delay: 0.5, color: "text-indigo-500/20" },
    { Icon: Code2, top: "68%", left: "4%", size: 30, duration: 8, delay: 1, color: "text-purple-400/15" },
    { Icon: ImageIcon, top: "82%", left: "90%", size: 26, duration: 6.5, delay: 1.5, color: "text-indigo-400/20" },
    { Icon: Layers, top: "45%", left: "95%", size: 24, duration: 9, delay: 0.3, color: "text-purple-500/15" },
    { Icon: Sparkles, top: "38%", left: "2%", size: 20, duration: 7, delay: 2, color: "text-indigo-500/15" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map(({ Icon, top, left, size, duration, delay, color }, idx) => (
        <motion.div
          key={idx}
          className={`absolute blur-[1px] ${color}`}
          style={{ top, left }}
          animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}
    </div>
  );
}

export default function ManageProjectsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<ManagedProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedProject | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setMounted(true), []);

  const user = session?.user as { role?: "admin" | "user" } | undefined;
  const showLoading = !mounted || isPending;
  const isAdmin = user?.role === "admin";

  // ---- Route guard: redirect non-admins home -------------------------------
  useEffect(() => {
    if (!showLoading && !isAdmin) {
      router.replace("/");
    }
  }, [showLoading, isAdmin, router]);

  // ---- Fetch all projects ---------------------------------------------------
  useEffect(() => {
    if (showLoading || !isAdmin) return;

    async function fetchProjects() {
      try {
        setLoadingProjects(true);
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects || []);
        } else {
          toast.error(data.message || "Failed to load projects.");
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast.error("Something went wrong while loading projects.");
      } finally {
        setLoadingProjects(false);
      }
    }

    fetchProjects();
  }, [showLoading, isAdmin]);

  const featuredCount = useMemo(
    () => projects.filter((p) => p.featured).length,
    [projects]
  );

  // ---- Feature toggle ---------------------------------------------------
  async function handleToggleFeatured(project: ManagedProject) {
    const id = getSafeId(project._id);
    const nextFeatured = !project.featured;

    setTogglingId(id);
    setProjects((prev) =>
      prev.map((p) => (getSafeId(p._id) === id ? { ...p, featured: nextFeatured } : p))
    );

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: nextFeatured }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      toast.success(
        nextFeatured ? "Project featured on homepage" : "Removed from featured"
      );
    } catch (err) {
      // revert optimistic update
      setProjects((prev) =>
        prev.map((p) =>
          getSafeId(p._id) === id ? { ...p, featured: !nextFeatured } : p
        )
      );
      toast.error("Failed to update featured status.");
    } finally {
      setTogglingId(null);
    }
  }

  // ---- Delete ---------------------------------------------------------------
  async function confirmDelete() {
    if (!deleteTarget) return;
    const id = getSafeId(deleteTarget._id);

    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setProjects((prev) => prev.filter((p) => getSafeId(p._id) !== id));
      toast.success("Project deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error("Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  }

  // ---- Guard / loading screens -----------------------------------------
  if (showLoading || (!isAdmin && !showLoading)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-800 border-t-purple-500" />
        <p className="animate-pulse text-sm font-medium tracking-wide text-neutral-400">
          {showLoading ? "Checking access..." : "Redirecting..."}
        </p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 p-4 text-neutral-200 antialiased md:p-8 lg:p-12">
      <FloatingIcons />

      <div className="relative z-10 mx-auto max-w-6xl space-y-8 md:space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-neutral-400 transition-all duration-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-5xl">
                Manage Projects
              </h1>
              <p className="mt-2 text-sm text-neutral-400 md:text-base">
                {projects.length} project{projects.length !== 1 ? "s" : ""} total ·{" "}
                {featuredCount} featured
              </p>
            </div>

            <Link
              href="/projects/add"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:from-indigo-500 hover:to-indigo-400 hover:shadow-indigo-600/40"
            >
              <Sparkles className="h-4 w-4" />
              Add New Project
            </Link>
          </div>
        </div>

        <hr className="border-neutral-900" />

        {/* Grid */}
        {loadingProjects ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-neutral-900 bg-neutral-900/40"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 py-24 text-center">
            <Boxes className="h-10 w-10 text-neutral-700" />
            <p className="text-neutral-500">No projects yet.</p>
            <Link
              href="/projects/add"
              className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Add your first project →
            </Link>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {projects.map((project) => {
                const id = getSafeId(project._id);
                const thumbnail = project.images?.[0];
                const isToggling = togglingId === id;

                return (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-900/40 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:shadow-2xl hover:shadow-purple-500/5"
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

                      {/* Feature toggle */}
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        disabled={isToggling}
                        title={project.featured ? "Remove from featured" : "Feature on homepage"}
                        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 disabled:opacity-50 ${
                          project.featured
                            ? "border-amber-400/40 bg-amber-400/20 text-amber-300"
                            : "border-neutral-700 bg-neutral-950/70 text-neutral-400 hover:border-amber-400/40 hover:text-amber-300"
                        }`}
                      >
                        {isToggling ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Star
                            className="h-4 w-4"
                            fill={project.featured ? "currentColor" : "none"}
                          />
                        )}
                      </button>

                      {project.featured && (
                        <span className="absolute left-3 top-3 rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <div>
                        <h3 className="line-clamp-1 text-lg font-bold text-white">
                          {project.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
                          {project.shortDescription}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
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

                      <div className="mt-auto flex items-center justify-between border-t border-neutral-900 pt-4 text-xs text-neutral-500">
                        <span className="capitalize">{project.category}</span>
                        <span>{project.hours} hrs</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => router.push(`/projects/edit/${id}`)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm font-medium text-neutral-300 transition-all duration-300 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm font-medium text-neutral-300 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 p-4 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/95 p-6 shadow-2xl backdrop-blur-xl"
            >
              <button
                onClick={() => !deleting && setDeleteTarget(null)}
                className="absolute right-4 top-4 rounded-lg p-1 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                  <AlertTriangle className="h-7 w-7 text-red-400" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">Delete this project?</h3>
                  <p className="mt-1.5 text-sm text-neutral-400">
                    Youre about to permanently delete{" "}
                    <span className="font-medium text-neutral-200">
                      "{deleteTarget.title}"
                    </span>
                    . This action cannot be undone.
                  </p>
                </div>

                <div className="mt-2 flex w-full gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={deleting}
                    className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-all duration-300 hover:bg-neutral-800 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/90 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 disabled:opacity-60"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}