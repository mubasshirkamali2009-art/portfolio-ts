"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiTailwindcss, SiTypescript, SiJavascript,
  SiMongodb, SiPostgresql, SiPrisma, SiDocker,
  SiFirebase, SiExpress, SiSupabase, SiRedux, SiCplusplus
} from "react-icons/si";
import {
  FaJava, FaPhp, FaVuejs, FaAngular, FaReact, FaNodeJs,
  FaArrowLeft, FaGithub, FaGlobe
} from "react-icons/fa6";
import { Star, MessageSquare, Loader2, Send } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

interface Review {
  userId: string;
  userName: string;
  userImage?: string | null;
  comment: string;
  rating: number;
  createdAt: string;
}

interface ProjectData {
  _id: any;
  title: string;
  liveLink: string;
  githubLink: string;
  linkedinLink: string;
  techStack: string[];
  category: string;
  date: string;
  hours: number;
  shortDescription: string;
  purpose: string;
  fullDescription: string;
  images?: string[];
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
}

const TECH_MAP: Record<string, { icon: React.ComponentType<any>; color: string }> = {
  "Next.js": { icon: FaReact, color: "text-white" },
  "React": { icon: FaReact, color: "text-sky-400" },
  "TypeScript": { icon: SiTypescript, color: "text-blue-500" },
  "JavaScript": { icon: SiJavascript, color: "text-amber-400" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "text-teal-400" },
  "Node.js": { icon: FaNodeJs, color: "text-green-500" },
  "Express": { icon: SiExpress, color: "text-slate-400" },
  "MongoDB": { icon: SiMongodb, color: "text-green-600" },
  "PostgreSQL": { icon: SiPostgresql, color: "text-blue-400" },
  "Prisma": { icon: SiPrisma, color: "text-purple-500" },
  "Firebase": { icon: SiFirebase, color: "text-amber-500" },
  "Supabase": { icon: SiSupabase, color: "text-emerald-500" },
  "Redux": { icon: SiRedux, color: "text-purple-400" },
  "C++": { icon: SiCplusplus, color: "text-blue-600" },
  "Java": { icon: FaJava, color: "text-orange-500" },
  "PHP": { icon: FaPhp, color: "text-indigo-300" },
  "Vue.js": { icon: FaVuejs, color: "text-emerald-400" },
  "Angular": { icon: FaAngular, color: "text-red-500" },
  "Docker": { icon: SiDocker, color: "text-blue-400" },
};

function getSafeId(idObj: any): string {
  if (!idObj) return "";
  if (typeof idObj === "string") return idObj;
  if (idObj.$oid) return idObj.$oid;
  if (idObj.toString) return idObj.toString();
  return String(idObj);
}

function getInitials(name?: string | null): string {
  const source = name?.trim() || "U";
  return source
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({
  value,
  size = 16,
  className = "",
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(value) ? "text-amber-400" : "text-neutral-700"}
          fill={n <= Math.round(value) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const projectId = unwrappedParams.id;

  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ---- Reviews state -------------------------------------------------------
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingInput, setRatingInput] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [commentInput, setCommentInput] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const currentUser = session?.user;

  async function getDetails() {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${projectId}`);

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      if (data.success) {
        setProject(data.project);
        setReviews(Array.isArray(data.project.reviews) ? data.project.reviews : []);
        setAverageRating(data.project.averageRating || 0);

        if (
          data.project.images &&
          Array.isArray(data.project.images) &&
          data.project.images.length > 0 &&
          data.project.images[0]
        ) {
          setSelectedImage(data.project.images[0]);
        } else {
          setSelectedImage(null);
        }
      } else {
        toast.error(data.message || "Failed to load project details.");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectId) {
      getDetails();
    }
  }, [projectId]);

  // ---- Submit a review — open to any signed-in user (admin or regular) ----
  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please log in to leave a review.");
      return;
    }
    if (ratingInput === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!commentInput.trim()) {
      toast.error("Please write a short comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: commentInput.trim(), rating: ratingInput }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit review");
      }

      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setCommentInput("");
      setRatingInput(0);
      toast.success("Thanks for sharing your experience!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white gap-4">
        <div className="w-12 h-12 border-4 border-t-purple-500 border-neutral-800 rounded-full animate-spin"></div>
        <p className="text-neutral-400 text-sm font-medium tracking-wide animate-pulse">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white gap-4">
        <p className="text-lg text-neutral-400">Project details could not be found.</p>
        <button onClick={() => router.back()} className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  const projectImages = Array.isArray(project.images)
    ? project.images.filter((img) => !!img)
    : [];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 antialiased selection:bg-purple-500/30 p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Back Navigation */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-all duration-300"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Projects</span>
        </button>

        {/* Hero Title Elements */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500 transition-all duration-500">
            {project.title}
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl font-light max-w-3xl leading-relaxed">
            {project.shortDescription}
          </p>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2.5 pt-1">
              <StarRating value={averageRating} size={18} />
              <span className="text-sm font-medium text-neutral-300">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-neutral-500">
                ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Image Display Blocks */}
        {selectedImage ? (
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 transition-transform duration-500 hover:scale-[1.005]">
              <Image
                src={selectedImage}
                alt={`${project.title} screenshot`}
                fill
                priority
                className="object-cover"
              />
            </div>
            {projectImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {projectImages.map((img, idx) => (
                  <button
                    key={`${getSafeId(project._id)}-img-${idx}`}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                      selectedImage === img ? "border-purple-500 scale-95" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 flex items-center justify-center">
            <span className="text-neutral-600 text-sm">No image available</span>
          </div>
        )}

        <hr className="border-neutral-900" />

        {/* Layout Splitting */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4 group">
              <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                Project Purpose
              </h2>
              <p className="text-neutral-400 leading-relaxed text-base whitespace-pre-line">
                {project.purpose}
              </p>
            </div>

            <div className="space-y-4 group">
              <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
                Full Specifications
              </h2>
              <p className="text-neutral-400 leading-relaxed text-base whitespace-pre-line">
                {project.fullDescription}
              </p>
            </div>

            {/* Built With tokens */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Built With</h3>
              <div className="flex flex-wrap gap-3">
                {project.techStack?.map((tech) => {
                  const target = TECH_MAP[tech];
                  if (!target) return (
                    <span key={tech} className="bg-neutral-900 border border-neutral-800 px-4 py-2 text-sm rounded-xl text-neutral-300">
                      {tech}
                    </span>
                  );
                  const Icon = target.icon;
                  return (
                    <div
                      key={tech}
                      className="flex items-center gap-2.5 bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/5 cursor-default"
                    >
                      <Icon className={`w-5 h-5 ${target.color}`} />
                      <span className="text-neutral-200">{tech}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* Reviews & Ratings — open to admin AND regular users        */}
            {/* ---------------------------------------------------------- */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">
                  Reviews & Ratings
                  {reviews.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-neutral-500">
                      ({reviews.length})
                    </span>
                  )}
                </h3>
              </div>

              {/* Review form */}
              <div className="rounded-2xl border border-neutral-900 bg-neutral-900/40 p-5 backdrop-blur-md">
                {sessionPending ? (
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking your session...
                  </div>
                ) : currentUser ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-medium text-neutral-300">Your rating</p>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setRatingInput(n)}
                            onMouseEnter={() => setHoverRating(n)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform duration-150 hover:scale-110"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                n <= (hoverRating || ratingInput)
                                  ? "text-amber-400"
                                  : "text-neutral-700"
                              }`}
                              fill={n <= (hoverRating || ratingInput) ? "currentColor" : "none"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-medium text-neutral-300">Your experience</p>
                      <textarea
                        rows={3}
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Share what you liked, what could be better, or how you used this project..."
                        className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none transition focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submittingReview ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        {submittingReview ? "Posting..." : "Post review"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-4 text-center">
                    <p className="text-sm text-neutral-400">
                      Log in to rate this project and share your experience.
                    </p>
                    <Link
                      href="/login"
                      className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-indigo-500 hover:to-indigo-400"
                    >
                      Log in
                    </Link>
                  </div>
                )}
              </div>

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 py-10 text-center">
                  <p className="text-sm text-neutral-500">
                    No reviews yet — be the first to share your experience.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {[...reviews].reverse().map((review, idx) => (
                      <motion.div
                        key={`${review.userId}-${review.createdAt}-${idx}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-2xl border border-neutral-900 bg-neutral-900/30 p-5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-800 text-xs font-semibold text-neutral-300 ring-2 ring-neutral-800">
                            {review.userImage ? (
                              <img
                                src={review.userImage}
                                alt={review.userName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(review.userName)
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="text-sm font-semibold text-neutral-100">
                                {review.userName}
                              </span>
                              <StarRating value={review.rating} size={13} />
                            </div>
                            {review.createdAt && (
                              <p className="mt-0.5 text-xs text-neutral-500">
                                {new Date(review.createdAt).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            )}
                            <p className="mt-2 text-sm leading-relaxed text-neutral-300 whitespace-pre-line">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-900 p-6 rounded-2xl space-y-6 shadow-xl">
              <h3 className="font-bold text-lg text-white tracking-wide">Project Details</h3>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="border-l-2 border-purple-500 pl-3">
                  <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">Category</span>
                  <span className="text-sm font-medium text-neutral-200 capitalize">{project.category}</span>
                </div>

                <div className="border-l-2 border-indigo-500 pl-3">
                  <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">Hours Invested</span>
                  <span className="text-sm font-medium text-neutral-200">{project.hours} hrs</span>
                </div>

                {reviews.length > 0 && (
                  <div className="border-l-2 border-amber-500 pl-3">
                    <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">Rating</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-neutral-200">{averageRating.toFixed(1)}</span>
                      <StarRating value={averageRating} size={12} />
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-neutral-900" />

              <div className="flex flex-col gap-3">
                {project.liveLink && (
                  <Link
                    href={project.liveLink}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full bg-white text-black font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-300 hover:bg-neutral-200"
                  >
                    <FaGlobe className="w-4 h-4" />
                    <span>Live Preview</span>
                  </Link>
                )}

                {project.githubLink && (
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white font-medium text-sm py-3 px-4 rounded-xl transition-all duration-300"
                  >
                    <FaGithub className="w-4 h-4 text-neutral-400" />
                    <span>Source Code</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}