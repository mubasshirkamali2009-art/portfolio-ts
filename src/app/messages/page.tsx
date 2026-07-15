// src/app/messages/page.tsx
import { auth, db } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import ChatWindow from "@/components/ChatWindow";

export default async function MessagesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any).role ?? "user";

  // ── Admin view: inbox / conversation list ──────────────────────────
  if (role === "admin") {
    const res = await fetch(
      `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/messages/conversations`,
      {
        headers: await headers(),
        cache: "no-store",
      }
    );
    const data = await res.json();
    const conversations = data.conversations ?? [];

    return (
      <div className="min-h-screen w-full bg-neutral-950 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">
              Inbox
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              যারা তোমাকে message করেছে তাদের list
            </p>
          </div>

          {conversations.length === 0 ? (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 text-center">
              <p className="text-sm text-neutral-500">
                এখনো কেউ message করেনি।
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((c: any) => (
                <Link
                  key={c.userId}
                  href={`/messages/${c.userId}`}
                  className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-all hover:border-indigo-500/40 hover:bg-neutral-900"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600/20 text-sm font-semibold text-indigo-300">
                    {c.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-neutral-100">
                        {c.name}
                      </p>
                      <p className="shrink-0 text-[11px] text-neutral-500">
                        {new Date(c.lastAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="truncate text-xs text-neutral-500">
                      {c.lastMessage}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="shrink-0 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-neutral-950">
                      {c.unreadCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Normal user view: সরাসরি owner এর সাথে chat ─────────────────────
  const owner = await db.collection("user").findOne({ role: "admin" });

  if (!owner) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
        <p className="text-sm text-neutral-500">
          এখন কথা বলার জন্য কেউ available নেই।
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">
            Message
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
           Dirrect chat with me
          </p>
        </div>
        <ChatWindow
          currentUserId={session.user.id}
          otherUserId={owner._id.toString()}
          otherUserName={owner.name ?? "Owner"}
        />
      </div>
    </div>
  );
}