// src/app/api/messages/route.ts
import { auth, db } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// একজন session user এর সাথে owner (admin) এর মধ্যেই সবসময় chat হবে,
// শুধু admin অন্য user select করে আলাদা userId পাঠাতে পারবে (query param দিয়ে)

async function getOwnerId() {
  const owner = await db.collection("user").findOne({ role: "admin" });
  return owner?._id?.toString() ?? null;
}

// GET /api/messages?userId=xxx  (userId optional, শুধু admin ব্যবহার করবে)
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUserId = session.user.id;
  const currentUserRole = (session.user as any).role ?? "user";

  const queryUserId = req.nextUrl.searchParams.get("userId");

  let otherUserId: string | null = null;

  if (currentUserRole === "admin") {
    // admin কে অবশ্যই কোন user এর সাথে chat দেখতে চায় সেটা বলতে হবে
    if (!queryUserId) {
      return NextResponse.json({ error: "userId প্রয়োজন" }, { status: 400 });
    }
    otherUserId = queryUserId;
  } else {
    // normal user সবসময় owner এর সাথেই কথা বলবে
    otherUserId = await getOwnerId();
    if (!otherUserId) {
      return NextResponse.json({ error: "Owner পাওয়া যায়নি" }, { status: 500 });
    }
  }

  const messages = await db
    .collection("messages")
    .find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    })
    .sort({ createdAt: 1 })
    .toArray();

  // admin এর পাঠানো message গুলো read মার্ক করে দাও (user দেখছে ধরে নিয়ে)
  if (currentUserRole !== "admin") {
    await db
      .collection("messages")
      .updateMany(
        { senderId: otherUserId, receiverId: currentUserId, read: false },
        { $set: { read: true } }
      );
  }

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m._id.toString(),
      senderId: m.senderId,
      receiverId: m.receiverId,
      text: m.text,
      createdAt: m.createdAt,
      read: m.read,
    })),
  });
}

// POST /api/messages   body: { text: string, receiverId?: string }
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text, receiverId } = await req.json();

  if (!text || !text.trim()) {
    return NextResponse.json({ error: "Message খালি হতে পারবে না" }, { status: 400 });
  }

  const currentUserId = session.user.id;
  const currentUserRole = (session.user as any).role ?? "user";

  let finalReceiverId = receiverId;

  if (currentUserRole !== "admin") {
    // normal user সবসময় owner কেই message পাঠাবে, receiverId front-end থেকে না দিলেও চলবে
    finalReceiverId = await getOwnerId();
  }

  if (!finalReceiverId) {
    return NextResponse.json({ error: "receiverId প্রয়োজন" }, { status: 400 });
  }

  const doc = {
    senderId: currentUserId,
    receiverId: finalReceiverId,
    text: text.trim(),
    createdAt: new Date(),
    read: false,
  };

  const result = await db.collection("messages").insertOne(doc);

  return NextResponse.json({
    message: { id: result.insertedId.toString(), ...doc },
  });
}