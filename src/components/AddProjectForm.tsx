"use client";
import { useState, useRef, useCallback, ChangeEvent, DragEvent, FormEvent } from "react";
import {
  UploadCloud,
  X,
  Link as LinkIcon,
  Clock,
  Loader2,
  ImagePlus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const IMGBB_API_KEY = ""; // optional: hardcode your imgbb key here, or paste it in the field below

type FormState = {
  title: string;
  liveLink: string;
  githubLink: string;
  linkedinLink: string;
  techStack: string;
  category: string;
  date: string;
  hours: string;
  shortDescription: string;
  purpose: string;
  fullDescription: string;
};

type ImageStatus = "uploading" | "done" | "error";

type ImageItem = {
  id: string;
  name: string;
  previewUrl: string;
  status: ImageStatus;
  url: string | null;
  error?: string;
};

const emptyForm: FormState = {
  title: "",
  liveLink: "",
  githubLink: "",
  linkedinLink: "",
  techStack: "",
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
        <label className="text-sm font-medium text-indigo-200/80">
          {label}
        </label>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-[#0e0e17] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20";

export default function AddProjectForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [images, setImages] = useState<ImageItem[]>([]);
  const [apiKey, setApiKey] = useState(IMGBB_API_KEY);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const uploadToImgbb = useCallback(
    async (file: File, localId: string) => {
      if (!apiKey) {
        setImages((imgs) =>
          imgs.map((img) =>
            img.id === localId
              ? { ...img, status: "error", error: "Missing imgbb API key" }
              : img
          )
        );
        return;
      }
      try {
        const base64: string = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const body = new URLSearchParams();
        body.append("image", base64);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          { method: "POST", body }
        );
        const data = await res.json();

        if (!res.ok || !data?.data?.url) {
          throw new Error(data?.error?.message || "Upload failed");
        }

        setImages((imgs) =>
          imgs.map((img) =>
            img.id === localId
              ? { ...img, status: "done", url: data.data.url }
              : img
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setImages((imgs) =>
          imgs.map((img) =>
            img.id === localId
              ? { ...img, status: "error", error: message }
              : img
          )
        );
      }
    },
    [apiKey]
  );

  const handleFiles = (fileList: FileList | null) => {
    const files = Array.from(fileList || []).filter((f) =>
      f.type.startsWith("image/")
    );
    files.forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const previewUrl = URL.createObjectURL(file);
      setImages((imgs) => [
        ...imgs,
        { id, name: file.name, previewUrl, status: "uploading", url: null },
      ]);
      uploadToImgbb(file, id);
    });
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) =>
    setImages((imgs) => imgs.filter((img) => img.id !== id));

  const retryImage = (id: string) => {
    setImages((imgs) => imgs.filter((i) => i.id !== id));
    toast.error("Re-add that image to retry the upload");
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) errs.title = "Required";
    if (!form.shortDescription.trim()) errs.shortDescription = "Required";
    if (!form.fullDescription.trim()) errs.fullDescription = "Required";
    if (form.hours && isNaN(Number(form.hours)))
      errs.hours = "Enter a number";

    (["liveLink", "githubLink", "linkedinLink"] as const).forEach((key) => {
      const val = form[key].trim();
      if (val && !/^https?:\/\/.+/i.test(val)) {
        errs[key] = "Include http(s)://";
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    const payload = {
      ...form,
      hours: form.hours ? Number(form.hours) : null,
      techStack: form.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: images.filter((i) => i.status === "done").map((i) => i.url),
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add project");
      }

      toast.success("Project added successfully!");
      setForm(emptyForm);
      setImages([]);
      router.refresh();
      // router.push("/projects"); // uncomment to redirect after save
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const uploadingCount = images.filter((i) => i.status === "uploading").length;

  return (
    <div className="min-h-screen w-full bg-[#0a0a10] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-[#0f0f18] p-5 shadow-2xl shadow-black/40 sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-xl font-semibold text-white sm:text-2xl">
              Add a new project
            </h1>
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

            <Field label="Technology stack" hint="comma separated">
              <input
                className={inputClasses}
                placeholder="React, Tailwind, Node.js"
                value={form.techStack}
                onChange={update("techStack")}
              />
            </Field>

            <Field label="Short description">
              <input
                className={inputClasses}
                placeholder="One line summary of the project"
                value={form.shortDescription}
                onChange={update("shortDescription")}
              />
              {errors.shortDescription && (
                <ErrorText text={errors.shortDescription} />
              )}
            </Field>

            <Field label="Category">
              <input
                className={inputClasses}
                placeholder="Web app, Mobile, API..."
                value={form.category}
                onChange={update("category")}
              />
            </Field>

            <Field label="Date">
              <input
                type="date"
                className={inputClasses}
                value={form.date}
                onChange={update("date")}
              />
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
              {errors.linkedinLink && (
                <ErrorText text={errors.linkedinLink} />
              )}
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
              {errors.fullDescription && (
                <ErrorText text={errors.fullDescription} />
              )}
            </Field>
          </div>

          {/* Images */}
          <div className="mt-5">
            <Field
              label="Project images"
              hint={uploadingCount ? `uploading ${uploadingCount}...` : "hosted via imgbb"}
            >
              {!IMGBB_API_KEY && (
                <input
                  className={`${inputClasses} mb-2.5`}
                  placeholder="Paste your imgbb API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              )}

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-[#0e0e17] px-4 py-8 text-center transition hover:border-indigo-500/50 hover:bg-indigo-500/5"
              >
                <UploadCloud className="h-6 w-6 text-slate-500" />
                <p className="text-sm text-slate-400">
                  <span className="font-medium text-indigo-300">
                    Click to upload
                  </span>{" "}
                  or drag and drop images here
                </p>
                <p className="text-xs text-slate-600">
                  PNG, JPG, GIF up to imgbb&apos;s limit
                </p>
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

              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#0e0e17]"
                    >
                      <img
                        src={img.url || img.previewUrl}
                        alt={img.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>

                      {img.status === "uploading" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Loader2 className="h-5 w-5 animate-spin text-indigo-300" />
                        </div>
                      )}
                      {img.status === "error" && (
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/70 p-2 text-center cursor-pointer"
                          onClick={() => retryImage(img.id)}
                        >
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <span className="text-[10px] text-red-300">
                            Failed — click to remove &amp; retry
                          </span>
                        </div>
                      )}
                      {img.status === "done" && (
                        <div className="absolute bottom-1.5 right-1.5 rounded-full bg-emerald-500/90 p-0.5">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/15 text-slate-500 transition hover:border-indigo-500/50 hover:text-indigo-300"
                  >
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-xs">Add more</span>
                  </button>
                </div>
              )}
            </Field>
          </div>

          {/* Submit */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={submitting || uploadingCount > 0}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit project"}
            </button>
          </div>
        </form>
      </div>
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