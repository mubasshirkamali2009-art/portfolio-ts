"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // lucide-react এর বদলে Next.js Link ব্যবহার করা হলো যাতে ক্র্যাশ না করে
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const DEMO_EMAIL = "mubasshirkamali2009@gmail.com";
const DEMO_PASSWORD = "bicsbics";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyPressed, setKeyPressed] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const loadingToast = toast.loading("Logging in...");

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    toast.dismiss(loadingToast);
    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message ?? "Invalid email or password.");
      toast.error(signInError.message ?? "Invalid email or password.");
      return;
    }

    toast.success("Welcome back!");
    router.push("/");
    router.refresh();
  }

  async function handleDemoLogin() {
    setError("");
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setIsSubmitting(true);

    const loadingToast = toast.loading("Logging in with demo account...");

    const { error: signInError } = await authClient.signIn.email({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    toast.dismiss(loadingToast);
    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message ?? "Demo login failed.");
      toast.error(signInError.message ?? "Demo login failed.");
      return;
    }

    toast.success("Welcome back!");
    router.push("/");
    router.refresh();
  }

  // আগের কোডের সব অ্যারে রেন্ডারিং সেফটির জন্য রেখে দেওয়া হলো
  const funcRow = Array.from({ length: 13 });
  const numRow = Array.from({ length: 13 });
  const qwertyRow = Array.from({ length: 12 });
  const asdfRow = Array.from({ length: 11 });
  const zxcvRow = Array.from({ length: 10 });

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-neutral-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl animate-pulse-slow" />

      {/* Main Beautiful Clean Card Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-xl shadow-2xl sm:p-8 animate-card-in"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-neutral-400">
              Log in to manage your projects
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400 animate-shake">
              {error}
            </p>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-neutral-700"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-neutral-700"
            />
          </div>

          {/* Login Buttons */}
          <div className="space-y-3 pt-2">
            {/* Main Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              onMouseDown={() => setKeyPressed(true)}
              onMouseUp={() => setKeyPressed(false)}
              onMouseLeave={() => setKeyPressed(false)}
              className={`w-full flex items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/10 ${
                keyPressed ? "scale-[0.98]" : ""
              }`}
            >
              {isSubmitting ? "Logging in..." : "Sign In"}
            </button>

            {/* Demo Login Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleDemoLogin}
              onMouseDown={() => setSpacePressed(true)}
              onMouseUp={() => setSpacePressed(false)}
              onMouseLeave={() => setSpacePressed(false)}
              className={`w-full flex items-center justify-center rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 py-3 text-sm font-medium text-amber-400 transition-all active:scale-[0.98] disabled:opacity-50 ${
                spacePressed ? "scale-[0.98]" : ""
              }`}
            >
              Try with Demo Account
            </button>
          </div>

          {/* Footer Utilities */}
          <div className="space-y-2 pt-2 border-t border-neutral-800/60 text-center">
            <p className="text-sm text-neutral-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Register
              </Link>
            </p>
            <p className="text-[11px] text-neutral-500">
              Press <span className="text-indigo-400 font-medium">Enter</span> to log in, or{" "}
              <span className="text-amber-400 font-medium">Space</span> for demo login
            </p>
          </div>

        </div>
      </form>
    </div>
  );
}