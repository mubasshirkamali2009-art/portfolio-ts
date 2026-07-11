"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // 1. প্রথমে authClient ইমপোর্ট করুন
import { Loader2, Calendar, Clock, ExternalLink, Star, MessageSquare } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import toast from "react-hot-toast";

// 2. authClient থেকে useSession হুকটি বের করে নিন
const { useSession } = authClient; 

interface Review {
  userId: string;
  userName: string;
  userImage?: string;
  comment: string;
  rating: number;
  createdAt: string;
}

interface ProjectData {
  _id: string;
  title: string;
  liveLink?: string;
  githubLink?: string;
  linkedinLink?: string;
  techStack: string[];
  category: string;
  date?: string;
  hours?: number;
  shortDescription: string;
  purpose?: string;
  fullDescription: string;
  images: string[];
  reviews?: Review[];
  averageRating?: number;
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");

  // Review states
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  // ১. প্রাতিষ্ঠানিক প্রটেকশন এবং ডেটা ফেচিং
  useEffect(() => {
    if (!isSessionLoading && !session) {
      toast.error("Please log in to view project details");
      router.push("/login");
      return;
    }

    if (session) {
      async function getDetails() {
        try {
          const res = await fetch(`/api/projects/${params.id}`);
          const data = await res.json();
          if (data.success) {
            setProject(data.project);
            if (data.project.images?.length > 0) {
              setActiveImg(data.project.images[0]);
            }
          } else {
            toast.error(data.message || "Failed to load project details");
          }
        } catch (err) {
          console.error(err);
          toast.error("Error connecting to server");
        } finally {
          setLoading(false);
        }
      }
      getDetails();
    }
  }, [session, isSessionLoading, params.id, router]);

  // ২. কমেন্ট এবং রেটিং সাবমিট হ্যান্ডলার
  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment, rating }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Thank you for your rating!");
        setComment("");
        // লোকাল স্টেট আপডেট করে সাথে সাথে UI পরিবর্তন দেখানো
        if (project) {
          setProject({
            ...project,
            reviews: data.reviews,
            averageRating: data.averageRating,
          });
        }
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isSessionLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a10]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-[#0a0a10] px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Title and Stats grid */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              {project.category}
            </span>
            <h1 className="mt-1 text-3xl font-extrabold text-white sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-2 text-slate-400">{project.shortDescription}</p>
          </div>
          
          {/* Average Rating Block */}
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0f0f18] px-4 py-3 sm:self-start">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Star className="h-6 w-6 fill-amber-500" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{project.averageRating || "0.0"} / 5</div>
              <div className="text-xs text-slate-500">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Media and Overview Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Gallery Left/Center (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f18]">
              <img src={activeImg} alt="Active preview" className="h-full w-full object-cover" />
            </div>
            {project.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(img)}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      activeImg === img ? "border-indigo-500" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumb" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Metadata Sidebar (1 col) */}
          <div className="rounded-2xl border border-white/10 bg-[#0f0f18] p-6 space-y-6">
            <h3 className="text-base font-semibold text-white">Project Specs</h3>
            
            <div className="space-y-4">
              {project.date && (
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>{new Date(project.date).toLocaleDateString()}</span>
                </div>
              )}
              {project.hours && (
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span>Spent ~{project.hours} working hours</span>
                </div>
              )}
            </div>

            {/* Tech stack pills */}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Built with</h4>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span key={tech} className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300 border border-white/5">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links Block */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex w-full items-center justify-between rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-indigo-500">
                  <span>Visit Live App</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <div className="grid grid-cols-2 gap-2">
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#0e0e17] py-2 text-sm text-slate-300 hover:bg-white/5">
                    <FaGithub /> GitHub
                  </a>
                )}
                {project.linkedinLink && (
                  <a href={project.linkedinLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#0e0e17] py-2 text-sm text-slate-300 hover:bg-white/5">
                    <FaLinkedin /> LinkedIn
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Descriptions */}
        <div className="mt-12 space-y-6 max-w-3xl">
          {project.purpose && (
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Purpose & Problem Solved</h3>
              <p className="text-sm leading-relaxed text-slate-400 whitespace-pre-line">{project.purpose}</p>
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Detailed Walkthrough</h3>
            <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">{project.fullDescription}</p>
          </div>
        </div>

        {/* Feedback Area: Comments & Ratings */}
        <div className="mt-16 border-t border-white/10 pt-10 grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Write a comment (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-400" /> Share Feedback
            </h3>
            
            <form onSubmit={handleReviewSubmit} className="space-y-4 rounded-xl border border-white/5 bg-[#0f0f18] p-4">
              
              {/* Rating Selector */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Select Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-amber-500 focus:outline-none"
                    >
                      <Star className={`h-6 w-6 ${rating >= star ? "fill-amber-500" : "text-slate-600"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What do you think about this project?"
                  className="w-full rounded-lg border border-white/10 bg-[#0e0e17] p-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-indigo-500/50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview || !comment.trim()}
                className="w-full rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-40"
              >
                {submittingReview ? "Submitting..." : "Post Review"}
              </button>
            </form>
          </div>

          {/* Active reviews listed (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-lg font-bold text-white">
              User Reviews ({project.reviews?.length || 0})
            </h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {project.reviews && project.reviews.length > 0 ? (
                project.reviews.map((rev, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-[#0f0f18] p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {rev.userImage ? (
                          <img src={rev.userImage} alt="" className="h-6 w-6 rounded-full object-cover" />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                            {rev.userName[0]}
                          </div>
                        )}
                        <span className="text-sm font-medium text-slate-200">{rev.userName}</span>
                      </div>

                      {/* Stars for this review */}
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-3 w-3 ${idx < rev.rating ? "fill-amber-500 text-amber-500" : "text-slate-700"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 pl-8">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-600 py-6">No ratings or reviews posted yet. Be the first one!</div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}