// components/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const funcRow = Array.from({ length: 13 });
  const numRow = Array.from({ length: 13 });
  const qwertyRow = Array.from({ length: 12 });
  const asdfRow = Array.from({ length: 11 });
  const zxcvRow = Array.from({ length: 10 });

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-neutral-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl animate-pulse-slow" />

      {/* perspective wrapper — this is what makes it read as 3D instead of stacked flat panels */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-3xl animate-card-in"
        style={{ perspective: "1600px" }}
      >
        <div style={{ transformStyle: "preserve-3d" }}>
          {/* ===================== SCREEN (slight backward tilt) ===================== */}
          <div
            className="relative mx-auto w-full origin-bottom rounded-t-2xl bg-gradient-to-b from-neutral-300 to-neutral-400 p-[4px] shadow-2xl sm:p-[6px]"
            style={{ transform: "rotateX(6deg)" }}
          >
            <div className="relative rounded-t-xl bg-black px-4 pt-4 pb-8 sm:px-8 sm:pt-6 sm:pb-12">
              <div className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-neutral-700" />

              <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-5 py-7 sm:px-10 sm:py-10">
                <h1 className="text-lg sm:text-2xl font-semibold text-neutral-100 text-center animate-fade-in-up [animation-delay:0.05s]">
                  Welcome back
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-neutral-400 text-center animate-fade-in-up [animation-delay:0.1s]">
                  Log in to manage your projects
                </p>

                <div className="mx-auto mt-5 max-w-sm space-y-3 sm:mt-7 sm:space-y-4">
                  <div className="animate-fade-in-up [animation-delay:0.15s]">
                    <label className="mb-1 block text-xs sm:text-sm font-medium text-neutral-300" htmlFor="email">
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
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 sm:py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 hover:border-neutral-600"
                    />
                  </div>

                  <div className="animate-fade-in-up [animation-delay:0.2s]">
                    <label className="mb-1 block text-xs sm:text-sm font-medium text-neutral-300" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 sm:py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 hover:border-neutral-600"
                    />
                  </div>

                  {error && (
                    <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs sm:text-sm text-red-400 animate-shake">
                      {error}
                    </p>
                  )}
                </div>

                <p className="mt-5 text-center text-xs sm:text-sm text-neutral-500 animate-fade-in-up [animation-delay:0.3s]">
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    Register
                  </a>
                </p>
                <p className="mt-2 text-center text-[11px] text-neutral-600 animate-fade-in-up [animation-delay:0.35s]">
                  Press <span className="text-indigo-400">Enter</span> to log in, or{" "}
                  <span className="text-amber-400">Space</span> for demo login
                </p>
              </div>
            </div>
          </div>

          {/* ===================== HINGE ===================== */}
          <div className="relative mx-auto h-3 w-[98%] bg-gradient-to-b from-neutral-400 via-neutral-500 to-neutral-400 shadow-inner" />

          {/* ===================== KEYBOARD DECK (tilted into 3D, receding away) ===================== */}
          <div
            className="relative mx-auto w-full origin-top rounded-b-2xl bg-gradient-to-b from-neutral-300 to-neutral-500 px-4 pb-8 pt-5 shadow-2xl sm:px-8 sm:pb-12 sm:pt-7"
            style={{ transform: "rotateX(55deg)" }}
          >
            <div className="rounded-xl bg-neutral-600/20 p-3 sm:p-5">
              {/* function row */}
              <div className="mb-2 grid grid-cols-13 gap-1.5 sm:gap-2">
                {funcRow.map((_, i) => (
                  <div key={i} className="h-4 rounded-[4px] bg-neutral-700/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:h-6" />
                ))}
              </div>
              {/* number row */}
              <div className="mb-2 grid grid-cols-13 gap-1.5 sm:gap-2">
                {numRow.map((_, i) => (
                  <div key={i} className="h-6 rounded-[4px] bg-neutral-700/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:h-9" />
                ))}
              </div>
              {/* qwerty row */}
              <div className="mb-2 flex gap-1.5 sm:gap-2">
                <div className="h-6 flex-[1.5] rounded-[4px] bg-neutral-700/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:h-9" />
                {qwertyRow.map((_, i) => (
                  <div key={i} className="h-6 flex-1 rounded-[4px] bg-neutral-700/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:h-9" />
                ))}
              </div>
              {/* asdf row */}
              <div className="mb-2 flex gap-1.5 sm:gap-2">
                <div className="h-6 flex-[1.8] rounded-[4px] bg-neutral-700/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:h-9" />
                {asdfRow.map((_, i) => (
                  <div key={i} className="h-6 flex-1 rounded-[4px] bg-neutral-700/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:h-9" />
                ))}
              </div>
              {/* zxcv row + real ENTER key */}
              <div className="mb-2 flex gap-1.5 sm:gap-2">
                <div className="h-6 flex-[2.2] rounded-[4px] bg-neutral-700/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:h-9" />
                {zxcvRow.map((_, i) => (
                  <div key={i} className="h-6 flex-1 rounded-[4px] bg-neutral-700/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:h-9" />
                ))}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseDown={() => setKeyPressed(true)}
                  onMouseUp={() => setKeyPressed(false)}
                  onMouseLeave={() => setKeyPressed(false)}
                  onTouchStart={() => setKeyPressed(true)}
                  onTouchEnd={() => setKeyPressed(false)}
                  className={`h-6 flex-[2.2] rounded-[4px] bg-gradient-to-b from-indigo-500 to-indigo-600 text-[9px] sm:text-xs font-bold text-white transition-all duration-100 disabled:cursor-not-allowed disabled:opacity-60 sm:h-9 ${
                    keyPressed
                      ? "translate-y-[3px] shadow-none"
                      : "shadow-[0_3px_0_rgba(49,46,129,0.9)] hover:from-indigo-400 hover:to-indigo-500"
                  }`}
                >
                  {isSubmitting ? "..." : "ENTER"}
                </button>
              </div>
              {/* bottom row + SPACEBAR (real demo-login button) */}
              <div className="flex gap-1.5 sm:gap-2">
                <div className="h-6 flex-[1.4] rounded-[4px] bg-neutral-700/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:h-9" />
                <div className="h-6 flex-[1.4] rounded-[4px] bg-neutral-700/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:h-9" />

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleDemoLogin}
                  onMouseDown={() => setSpacePressed(true)}
                  onMouseUp={() => setSpacePressed(false)}
                  onMouseLeave={() => setSpacePressed(false)}
                  onTouchStart={() => setSpacePressed(true)}
                  onTouchEnd={() => setSpacePressed(false)}
                  title="Demo login"
                  className={`h-6 flex-[6] rounded-[4px] bg-gradient-to-b from-amber-400 to-amber-500 text-[8px] sm:text-[10px] font-bold tracking-wide text-neutral-900 transition-all duration-100 disabled:cursor-not-allowed disabled:opacity-60 sm:h-9 ${
                    spacePressed
                      ? "translate-y-[3px] shadow-none"
                      : "shadow-[0_3px_0_rgba(146,64,14,0.9)] hover:from-amber-300 hover:to-amber-400"
                  }`}
                >
                  {isSubmitting ? "..." : "DEMO LOGIN"}
                </button>

                <div className="h-6 flex-[1.4] rounded-[4px] bg-neutral-700/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:h-9" />
                <div className="h-6 flex-[1.4] rounded-[4px] bg-neutral-700/80 shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:h-9" />
              </div>
            </div>
          </div>
        </div>

        {/* grounded shadow beneath the whole laptop */}
        <div className="mx-auto mt-4 h-4 w-[80%] rounded-full bg-black/50 blur-lg" />
      </form>
    </div>
  );
}