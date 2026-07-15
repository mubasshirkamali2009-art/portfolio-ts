// src/app/messages/[userId]/page.tsx
import { auth, db } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ObjectId } from "mongodb";
import ChatWindow from "@/components/ChatWindow";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const role = (session.user as any).role ?? "user";
  if (role !== "admin") {
    // normal user এর এই page এ আসার দরকার নেই, নিজের chat page এ পাঠিয়ে দাও
    redirect("/messages");
  }

  let otherUser;
  try {
    otherUser = await db
      .collection("user")
      .findOne({ _id: new ObjectId(userId) });
  } catch {
    notFound();
  }

  if (!otherUser) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/messages"
          className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-indigo-400"
        >
          ← Inbox এ ফিরে যাও
        </Link>
        <ChatWindow
          currentUserId={session.user.id}
          otherUserId={otherUser._id.toString()}
          otherUserName={otherUser.name ?? "User"}
          isAdminView
        />
      </div>
    </div>
  );
}