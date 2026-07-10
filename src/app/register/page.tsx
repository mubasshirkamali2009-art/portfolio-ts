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
    role: "user", // default selected — matters, an empty default is how bugs like
                  // "role submitted as blank" happen when a user never touches it
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  async function handleGoogleClick() {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("Could not sign up with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-neutral-950 px-4 sm:px-6 lg:px-8">
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

      {/* floating tech icons */}
      <Code2 className="pointer-events-none absolute left-[10%] top-[18%] h-7 w-7 text-indigo-400/40 animate-float [animation-delay:0s]" />
      <Braces className="pointer-events-none absolute right-[12%] top-[24%] h-6 w-6 text-amber-400/40 animate-float [animation-delay:0.6s]" />
      <Terminal className="pointer-events-none absolute left-[8%] bottom-[20%] h-6 w-6 text-indigo-400/30 animate-float [animation-delay:1.2s]" />
      <GitBranch className="pointer-events-none absolute right-[8%] bottom-[16%] h-6 w-6 text-amber-400/30 animate-float [animation-delay:0.3s]" />
      <Wifi className="pointer-events-none absolute right-[20%] top-[10%] h-5 w-5 text-emerald-400/40 animate-pulse-slow hidden sm:block" />
      <Laptop2 className="pointer-events-none absolute left-[18%] top-[8%] h-6 w-6 text-neutral-500/40 animate-float [animation-delay:0.9s] hidden md:block" />

      {/* card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:shadow-indigo-900/30">
        <h1 className="text-xl sm:text-2xl font-semibold text-neutral-100 text-center">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-neutral-400 text-center">
          Join and start managing your projects
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name */}
          <div>
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
          <div>
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
          <div>
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
          <div>
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

          {/* Role selector */}
          <div>
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
            <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:from-indigo-500 hover:to-indigo-400 hover:shadow-lg hover:shadow-indigo-600/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-800" />
          <span className="text-xs text-neutral-500">or</span>
          <div className="h-px flex-1 bg-neutral-800" />
        </div>

        {/* Google sign up */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={isGoogleLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm font-medium text-neutral-200 transition-all duration-200 hover:border-neutral-600 hover:bg-neutral-900 hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.85z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z"/>
          </svg>
          {isGoogleLoading ? "Redirecting..." : "Sign up with Google"}
        </button>

        <p className="mt-5 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}