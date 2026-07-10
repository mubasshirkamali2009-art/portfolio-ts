// components/RegisterForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Code2, Braces, Terminal, GitBranch, Wifi, Laptop2 } from "lucide-react";

type Role = "admin" | "user";

interface FormData {
  name: string;
  photoUrl: string;
  email: string;
  password: string;
  role: Role;
}

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    photoUrl: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleRoleChange(role: Role) {
    setFormData({ ...formData, role });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const loadingToast = toast.loading("Creating your account...");

    const { error: signUpError } = await authClient.signUp.email({
      name: formData.name,
      image: formData.photoUrl || undefined,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    toast.dismiss(loadingToast);
    setIsSubmitting(false);

    if (signUpError) {
      setError(signUpError.message ?? "Something went wrong. Please try again.");
      toast.error(signUpError.message ?? "Something went wrong. Please try again.");
      return;
    }

    toast.success("Registered successfully!");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-neutral-950 px-4 py-10 sm:px-6 lg:px-8">
      {/* animated gradient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-indigo-600/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl animate-blob [animation-delay:2s]" />

      {/* faint dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(#3f3f46 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* floating tech icons — hidden on small screens, positioned to stay clear of the card on laptop widths */}
      <Code2 className="pointer-events-none absolute left-[6%] top-[15%] h-7 w-7 text-indigo-400/40 animate-float [animation-delay:0s] hidden lg:block" />
      <Braces className="pointer-events-none absolute right-[8%] top-[20%] h-6 w-6 text-amber-400/40 animate-float [animation-delay:0.6s] hidden lg:block" />
      <Terminal className="pointer-events-none absolute left-[5%] bottom-[18%] h-6 w-6 text-indigo-400/30 animate-float [animation-delay:1.2s] hidden lg:block" />
      <GitBranch className="pointer-events-none absolute right-[5%] bottom-[14%] h-6 w-6 text-amber-400/30 animate-float [animation-delay:0.3s] hidden lg:block" />
      <Wifi className="pointer-events-none absolute right-[16%] top-[8%] h-5 w-5 text-emerald-400/40 animate-pulse-slow hidden xl:block" />
      <Laptop2 className="pointer-events-none absolute left-[14%] top-[6%] h-6 w-6 text-neutral-500/40 animate-float [animation-delay:0.9s] hidden xl:block" />

      {/* card */}
      <div className="relative z-10 my-auto w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:shadow-indigo-900/30 animate-card-in">
        <h1 className="text-xl sm:text-2xl font-semibold text-neutral-100 text-center animate-fade-in-up [animation-delay:0.05s]">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-neutral-400 text-center animate-fade-in-up [animation-delay:0.1s]">
          Join and start managing your projects
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name */}
          <div className="animate-fade-in-up [animation-delay:0.15s]">
            <label className="mb-1 block text-sm font-medium text-neutral-300" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 hover:border-neutral-600"
            />
          </div>

          {/* Image URL */}
          <div className="animate-fade-in-up [animation-delay:0.2s]">
            <label className="mb-1 block text-sm font-medium text-neutral-300" htmlFor="photoUrl">
              Image URL <span className="text-neutral-500">(optional)</span>
            </label>
            <input
              id="photoUrl"
              name="photoUrl"
              type="url"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://example.com/avatar.png"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 hover:border-neutral-600"
            />
          </div>

          {/* Email */}
          <div className="animate-fade-in-up [animation-delay:0.25s]">
            <label className="mb-1 block text-sm font-medium text-neutral-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 hover:border-neutral-600"
            />
          </div>

          {/* Password */}
          <div className="animate-fade-in-up [animation-delay:0.3s]">
            <label className="mb-1 block text-sm font-medium text-neutral-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 hover:border-neutral-600"
            />
          </div>

          {/* Role selector (kept hidden, same as before) */}
          <div className="hidden">
            <label className="mb-2 block text-sm font-medium text-neutral-300">Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("user")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${
                  formData.role === "user"
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-300 shadow-md shadow-indigo-500/20"
                    : "border-neutral-700 bg-neutral-950 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("admin")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${
                  formData.role === "admin"
                    ? "border-amber-500 bg-amber-500/10 text-amber-300 shadow-md shadow-amber-500/20"
                    : "border-neutral-700 bg-neutral-950 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400 animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:from-indigo-500 hover:to-indigo-400 hover:shadow-lg hover:shadow-indigo-600/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 animate-fade-in-up [animation-delay:0.35s]"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-neutral-500 animate-fade-in-up [animation-delay:0.4s]">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}