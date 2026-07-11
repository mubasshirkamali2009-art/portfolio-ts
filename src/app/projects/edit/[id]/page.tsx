// src/app/projects/edit/[id]/page.tsx
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  DragEvent,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  UploadCloud,
  X,
  Link as LinkIcon,
  Clock,
  Loader2,
  ImagePlus,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaReact,
  FaNodeJs,
  FaPython,
  FaHtml5,
  FaCss3Alt,
  FaJava,
  FaPhp,
  FaVuejs,
  FaAngular,
} from "react-icons/fa6";
import {
  SiTailwindcss,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiDocker,
  SiFirebase,
  SiExpress,
  SiSupabase,
  SiRedux,
  SiCplusplus,
} from "react-icons/si";
import { authClient } from "@/lib/auth-client";

const IMGBB_API_KEY = "e3eeed8b6ec741ec8f894c190fdeeff1";
const MAX_IMAGES = 5;

const AVAILABLE_TECH = [
  { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
  { name: "React", icon: FaReact, color: "text-sky-400" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" },
  { name: "JavaScript", icon: SiJavascript, color: "text-amber-400" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-teal-400" },
  { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
  { name: "Express", icon: SiExpress, color: "text-slate-400" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green-400" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "text-blue-400" },
  { name: "Prisma", icon: SiPrisma, color: "text-indigo-400" },
  { name: "Firebase", icon: SiFirebase, color: "text-amber-500" },
  { name: "Supabase", icon: SiSupabase, color: "text-emerald-500" },
  { name: "Redux", icon: SiRedux, color: "text-purple-500" },
  { name: "Python", icon: FaPython, color: "text-yellow-500" },
  { name: "C++", icon: SiCplusplus, color: "text-blue-600" },
  { name: "Java", icon: FaJava, color: "text-orange-500" },
  { name: "PHP", icon: FaPhp, color: "text-indigo-300" },
  { name: "Vue.js", icon: FaVuejs, color: "text-emerald-400" },
  { name: "Angular", icon: FaAngular, color: "text-red-500" },
  { name: "Docker", icon: SiDocker, color: "text-blue-400" },
  { name: "HTML5", icon: FaHtml5, color: "text-orange-600" },
  { name: "CSS3", icon: FaCss3Alt, color: "text-blue-400" },
];

type FormState = {
  title: string;
  liveLink: string;
  githubLink: string;
  linkedinLink: string;
  category: string;
  date: string;
  hours: string;
  shortDescription: string;
  purpose: string;
  fullDescription: string;
};

const emptyForm: FormState = {
  title: "",
  liveLink: "",
  githubLink: "",
  linkedinLink: "",
  category: "",
  date: "",
  hours: "",
  shortDescription: "",
  purpose: "",
  fullDescription: "",
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-indigo-200/80">{label}</label>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ErrorText({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-red-400">
      <AlertCircle className="h-3 w-3" />
      {text}
    </span>
  );
}

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-[#0e0e17] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const projectId = unwrappedParams.id;

  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const user = session?.user as { role?: "admin" | "user" } | undefined;
  const showAuthLoading = !mounted || isPending;
  const isAdmin = user?.role === "admin";

  // ---- Route guard -----------------------------------------------------
  useEffect(() => {
    if (!showAuthLoading && !isAdmin) {
      router.replace("/");
    }
  }, [showAuthLoading, isAdmin, router]);

  // ---- Project data ------------------------------------------------------
  const [loadingProject, setLoadingProject] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Existing images already saved on the project (URLs)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // Newly picked files (not yet uploaded)
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalImageCount = existingImages.length + newImageFiles.length;

  // ---- Fetch project to edit ---------------------------------------------
  useEffect(() => {
    if (showAuthLoading || !isAdmin || !projectId) return;

    async function fetchProject() {
      try {
        setLoadingProject(true);
        const res = await fetch(`/api/projects/${projectId}`);
        const data = await res.json();

        if (!data.success) {
          setNotFound(true);
          toast.error(data.message || "Project not found");
          return;
        }

        const p = data.project;
        setForm({
          title: p.title || "",
          liveLink: p.liveLink || "",
          githubLink: p.githubLink || "",
          linkedinLink: p.linkedinLink || "",
          category: p.category || "",
          date: p.date ? String(p.date).slice(0, 10) : "",
          hours: p.hours != null ? String(p.hours) : "",
          shortDescription: p.shortDescription || "",
          purpose: p.purpose || "",
          fullDescription: p.fullDescription || "",
        });
        setSelectedTech(Array.isArray(p.techStack) ? p.techStack : []);
        setExistingImages(Array.isArray(p.images) ? p.images.filter(Boolean) : []);
      } catch (err) {
        console.error("Error fetching project:", err);
        toast.error("Something went wrong while loading the project.");
        setNotFound(true);
      } finally {
        setLoadingProject(false);
      }
    }

    fetchProject();
  }, [showAuthLoading, isAdmin, projectId]);

  const update =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleTechnology = (techName: string) => {
    setSelectedTech((prev) =>
      prev.includes(techName) ? prev.filter((t) => t !== techName) : [...prev, techName]
    );
  };

  // ---- Image handling -----------------------------------------------------
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const incoming = Array.from(files);
    const room = MAX_IMAGES - totalImageCount;

    if (room <= 0) {
      toast.error(`You can have up to ${MAX_IMAGES} images total.`);
      return;
    }

    const accepted: File[] = [];
    for (const file of incoming.slice(0, room)) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload image files only.");
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length > 0) {
      setNewImageFiles((prev) => [...prev, ...accepted]);
      setNewImagePreviews((prev) => [...prev, ...accepted.map((f) => URL.createObjectURL(f))]);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeExistingImageAt = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImageAt = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImageToImgBB = async (file: File) => {
    const imgFormData = new FormData();
    imgFormData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: imgFormData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload one or more images to ImgBB.");
    }

    const data = await res.json();
    return data.data.url;
  };

  // ---- Validation -----------------------------------------------------------
  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) errs.title = "Required";
    if (!form.shortDescription.trim()) errs.shortDescription = "Required";
    if (!form.fullDescription.trim()) errs.fullDescription = "Required";
    if (form.hours && isNaN(Number(form.hours))) errs.hours = "Enter a number";

    if (selectedTech.length === 0) {
      toast.error("Please select at least one technology stack.");
      return false;
    }

    if (totalImageCount === 0) {
      toast.error("At least one project image is required.");
      return false;
    }

    (["liveLink", "githubLink", "linkedinLink"] as const).forEach((key) => {
      const val = form[key].trim();
      if (val && !/^https?:\/\/.+/i.test(val)) {
        errs[key] = "Include http(s)://";
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---- Submit -----------------------------------------------------------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);

    try {
      const uploadedUrls = await Promise.all(newImageFiles.map((f) => uploadImageToImgBB(f)));
      const finalImages = [...existingImages, ...uploadedUrls];

      const payload = {
        ...form,
        hours: form.hours ? Number(form.hours) : null,
        techStack: selectedTech,
        images: finalImages,
      };

      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update project");
      }

      toast.success("Project updated successfully!");
      router.push("/projects/manage");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Guard / loading screens -------------------------------------------
  if (showAuthLoading || (!isAdmin && !showAuthLoading)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0a10] text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-indigo-500" />
        <p className="animate-pulse text-sm font-medium tracking-wide text-slate-400">
          {showAuthLoading ? "Checking access..." : "Redirecting..."}
        </p>
      </div>
    );
  }

  if (loadingProject) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0a10] text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-indigo-500" />
        <p className="animate-pulse text-sm font-medium tracking-wide text-slate-400">
          Loading project...
        </p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0a10] text-white">
        <p className="text-slate-400">This project could not be found.</p>
        <Link
          href="/projects/manage"
          className="flex items-center gap-2 text-sm text-indigo-400 transition-colors hover:text-indigo-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Manage Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a10] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/projects/manage"
          className="group mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-all duration-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Manage Projects
        </Link>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#0f0f18] p-5 shadow-2xl shadow-black/40 sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-xl font-semibold text-white sm:text-2xl">Edit project</h1>
          </div>

          {/* Core info */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Title">
              <input
                className={inputClasses}
                placeholder="Portfolio v3"
                value={form.title}
                onChange={update("title")}
              />
              {errors.title && <ErrorText text={errors.title} />}
            </Field>

            <Field label="Category">
              <input
                className={inputClasses}
                placeholder="Web app, Mobile, API..."
                value={form.category}
                onChange={update("category")}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Technology stack" hint={`Selected: ${selectedTech.length}`}>
                <div className="custom-scrollbar grid max-h-[220px] grid-cols-2 gap-2 overflow-y-auto rounded-xl border border-white/5 bg-[#0b0b12] p-4 sm:grid-cols-3 md:grid-cols-4">
                  {AVAILABLE_TECH.map((tech) => {
                    const Icon = tech.icon;
                    const isSelected = selectedTech.includes(tech.name);
                    return (
                      <button
                        type="button"
                        key={tech.name}
                        onClick={() => toggleTechnology(tech.name)}
                        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-all ${
                          isSelected
                            ? "border-indigo-500/60 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/5"
                            : "border-white/5 bg-[#0e0e17] text-slate-400 hover:border-white/10 hover:text-slate-200"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 ${isSelected ? tech.color : "text-slate-500"}`}
                        />
                        <span className="truncate text-xs font-medium">{tech.name}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>

            <Field label="Short description">
              <input
                className={inputClasses}
                placeholder="One line summary of the project"
                value={form.shortDescription}
                onChange={update("shortDescription")}
              />
              {errors.shortDescription && <ErrorText text={errors.shortDescription} />}
            </Field>

            <Field label="Date">
              <input type="date" className={inputClasses} value={form.date} onChange={update("date")} />
            </Field>

            <Field label="Hours spent" hint="approx.">
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  min="0"
                  className={`${inputClasses} pl-9`}
                  placeholder="40"
                  value={form.hours}
                  onChange={update("hours")}
                />
              </div>
              {errors.hours && <ErrorText text={errors.hours} />}
            </Field>
          </div>

          {/* Links */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Live link">
              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  className={`${inputClasses} pl-9`}
                  placeholder="https://myproject.com"
                  value={form.liveLink}
                  onChange={update("liveLink")}
                />
              </div>
              {errors.liveLink && <ErrorText text={errors.liveLink} />}
            </Field>

            <Field label="GitHub repo">
              <div className="relative">
                <FaGithub className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  className={`${inputClasses} pl-9`}
                  placeholder="https://github.com/you/repo"
                  value={form.githubLink}
                  onChange={update("githubLink")}
                />
              </div>
              {errors.githubLink && <ErrorText text={errors.githubLink} />}
            </Field>

            <Field label="LinkedIn post">
              <div className="relative">
                <FaLinkedin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  className={`${inputClasses} pl-9`}
                  placeholder="https://linkedin.com/posts/..."
                  value={form.linkedinLink}
                  onChange={update("linkedinLink")}
                />
              </div>
              {errors.linkedinLink && <ErrorText text={errors.linkedinLink} />}
            </Field>
          </div>

          {/* Purpose */}
          <div className="mt-5">
            <Field label="Purpose" hint="why you built this">
              <textarea
                rows={3}
                className={`${inputClasses} resize-none`}
                placeholder="What problem does this project solve, and why did you build it?"
                value={form.purpose}
                onChange={update("purpose")}
              />
            </Field>
          </div>

          {/* Full description */}
          <div className="mt-5">
            <Field label="Full description">
              <textarea
                rows={5}
                className={`${inputClasses} resize-none`}
                placeholder="Walk through what the project does, key features, and technical decisions..."
                value={form.fullDescription}
                onChange={update("fullDescription")}
              />
              {errors.fullDescription && <ErrorText text={errors.fullDescription} />}
            </Field>
          </div>

          {/* Images */}
          <div className="mt-5">
            <Field label="Project images" hint={`Selected: ${totalImageCount} / ${MAX_IMAGES}`}>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-[#0e0e17] px-4 py-8 text-center transition hover:border-indigo-500/50 hover:bg-indigo-500/5"
              >
                <UploadCloud className="h-6 w-6 text-slate-500" />
                <p className="text-sm text-slate-400">
                  <span className="font-medium text-indigo-300">Click to upload</span> or drag and
                  drop images here
                </p>
                <p className="text-xs text-slate-600">PNG, JPG, GIF up to 5MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {/* Existing images already saved on this project */}
                  {existingImages.map((src, i) => (
                    <div
                      key={`existing-${src}`}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#0e0e17]"
                    >
                      <img src={src} alt={`Existing ${i + 1}`} className="h-full w-full object-cover" />
                      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-slate-300">
                        Saved
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExistingImageAt(i);
                        }}
                        className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Newly added, not-yet-uploaded images */}
                  {newImagePreviews.map((src, i) => (
                    <div
                      key={`new-${src}`}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-indigo-500/30 bg-[#0e0e17]"
                    >
                      <img src={src} alt={`New ${i + 1}`} className="h-full w-full object-cover" />
                      <span className="absolute bottom-1.5 left-1.5 rounded bg-indigo-500/80 px-1.5 py-0.5 text-[10px] text-white">
                        New
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNewImageAt(i);
                        }}
                        className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {totalImageCount < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/15 text-slate-500 transition hover:border-indigo-500/50 hover:text-indigo-300"
                    >
                      <ImagePlus className="h-5 w-5" />
                      <span className="text-xs">Add more</span>
                    </button>
                  )}
                </div>
              )}
            </Field>
          </div>

          {/* Submit */}
          <div className="mt-8 flex justify-end gap-3">
            <Link
              href="/projects/manage"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0e0e17] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}