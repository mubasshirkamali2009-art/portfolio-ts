"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Pencil, X, User as UserIcon, Mail, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openEdit() {
    setName(user?.name || "");
    setImage(user?.image || "");
    setError("");
    setIsEditOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await authClient.updateUser({
        name,
        image: image || undefined,
      });
      setIsEditOpen(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a10]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a10] px-4 text-center text-slate-400">
        You need to be signed in to view this page.
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-[#0a0a10] px-4 py-12 text-slate-100 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto w-full max-w-xl md:max-w-2xl lg:max-w-3xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center sm:mb-10"
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            My <span className="text-indigo-500">Profile</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            View and manage your account information.
          </p>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f18] p-6 sm:p-8 md:p-10"
        >
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6 md:gap-8">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-indigo-600/20 text-2xl font-bold text-indigo-400 sm:h-24 sm:w-24 md:h-28 md:w-28 md:text-3xl">
              {user.image ? (
                <img src={user.image} alt={user.name || "Profile"} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>

            {/* Info */}
            <div className="flex w-full flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">{user.name || "Unnamed User"}</h2>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-400 sm:justify-start">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="break-all">{user.email}</span>
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                {(user as { role?: string }).role || "user"}
              </span>
            </div>

            {/* Edit button */}
            <button
              onClick={openEdit}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:mt-0 sm:w-auto md:px-6"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Extra info row (responsive grid) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0f0f18] p-5 sm:p-6">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
              <UserIcon className="h-3.5 w-3.5" />
              User ID
            </p>
            <p className="mt-1.5 break-all text-sm font-medium text-slate-200">{user.id}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0f0f18] p-5 sm:p-6">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              Email Verified
            </p>
            <p className="mt-1.5 text-sm font-medium text-slate-200">
              {user.emailVerified ? "Yes" : "No"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => !saving && setIsEditOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f0f18] p-6 sm:max-w-md sm:p-7 md:max-w-lg md:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white sm:text-xl">Edit Profile</h3>
                <button
                  onClick={() => !saving && setIsEditOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Live preview */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-indigo-600/20 text-xl font-bold text-indigo-400 sm:h-24 sm:w-24">
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                  ) : (
                    name
                      ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                      : "U"
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-[#151521] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
                    Profile Image URL
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full rounded-xl border border-white/10 bg-[#151521] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500/50"
                  />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setIsEditOpen(false)}
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}