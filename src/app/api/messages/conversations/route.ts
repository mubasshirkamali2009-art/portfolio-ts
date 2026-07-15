// src/app/api/messages/conversations/route.ts
import { auth, db } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// শুধু admin ব্যবহার করবে — কে কে message করেছে তার list, সাথে last message + unread count
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any).role ?? "user";
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ownerId = session.user.id;

  // owner এর সাথে জড়িত সব message থেকে unique other-user বের করা
  const messages = await db
    .collection("messages")
    .find({
      $or: [{ senderId: ownerId }, { receiverId: ownerId }],
    })
    .sort({ createdAt: -1 })
    .toArray();

  const conversationMap = new Map<
    string,
    { lastMessage: string; lastAt: Date; unreadCount: number }
  >();

  for (const m of messages) {
    const otherId = m.senderId === ownerId ? m.receiverId : m.senderId;

    if (!conversationMap.has(otherId)) {
      conversationMap.set(otherId, {
        lastMessage: m.text,
        lastAt: m.createdAt,
        unreadCount: 0,
      });
    }

    if (m.receiverId === ownerId && !m.read) {
      conversationMap.get(otherId)!.unreadCount += 1;
    }
  }

  const otherIds = Array.from(conversationMap.keys());

  const users = await db
    .collection("user")
    .find({ _id: { $in: otherIds.map((id) => new ObjectId(id)) } })
    .toArray();

  const conversations = otherIds.map((id) => {
    const user = users.find((u) => u._id.toString() === id);
    const meta = conversationMap.get(id)!;
    return {
      userId: id,
      name: user?.name ?? "Unknown",
      email: user?.email ?? "",
      image: user?.image ?? null,
      lastMessage: meta.lastMessage,
      lastAt: meta.lastAt,
      unreadCount: meta.unreadCount,
    };
  });

  conversations.sort(
    (a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()
  );

  return NextResponse.json({ conversations });
}