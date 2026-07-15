// src/components/ChatWindow.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

interface ChatWindowProps {
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
  isAdminView?: boolean; // true হলে API কল এ ?userId= পাঠাবে
}

const POLL_INTERVAL = 3000; // 3 সেকেন্ড পরপর check করবে

export default function ChatWindow({
  currentUserId,
  otherUserId,
  otherUserName,
  isAdminView = false,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  const prevCountRef = useRef(0);

  // scrollIntoView পুরো page-কে scroll করে দেয় (page jump / header হারিয়ে যাওয়ার bug),
  // তাই শুধু chat container-এর ভিতরেই scrollTop সেট করছি — বাইরের page touch হবে না
  function scrollToBottom(smooth: boolean) {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }

  const fetchUrl = isAdminView
    ? `/api/messages?userId=${otherUserId}`
    : "/api/messages";

  async function loadMessages() {
    try {
      const res = await fetch(fetchUrl);
      if (!res.ok) return;
      const data = await res.json();
      const incoming: Message[] = data.messages ?? [];

      // শুধু তখনই state update করো যদি message সংখ্যা বা শেষ message আগের থেকে আলাদা হয়
      setMessages((prev) => {
        if (
          prev.length === incoming.length &&
          prev[prev.length - 1]?.id === incoming[incoming.length - 1]?.id
        ) {
          return prev; // কিছু বদলায়নি, একই reference রাখো — re-render/scroll ট্রিগার হবে না
        }
        return incoming;
      });
    } catch {
      // silent fail — polling হচ্ছে তো, পরের বার আবার try করবে
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, POLL_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserId]);

  useEffect(() => {
    // প্রথমবার load হলে scroll করো (animation ছাড়া), নতুন message এলে smooth scroll করো,
    // কিন্তু length না বাড়লে কিছুই করো না (glitch এড়ানোর জন্য)
    if (isFirstLoad.current && messages.length > 0) {
      scrollToBottom(false);
      isFirstLoad.current = false;
      prevCountRef.current = messages.length;
      return;
    }

    if (messages.length > prevCountRef.current) {
      scrollToBottom(true);
    }
    prevCountRef.current = messages.length;
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || isSending) return;

    setIsSending(true);
    const body = isAdminView
      ? { text: text.trim(), receiverId: otherUserId }
      : { text: text.trim() };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        toast.error("Message পাঠানো যায়নি");
        return;
      }

      setText("");
      await loadMessages();
    } catch {
      toast.error("কিছু ভুল হয়েছে");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-[70vh] w-full flex-col rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-800 bg-neutral-950/60 px-5 py-3.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600/20 text-sm font-semibold text-indigo-300">
          {otherUserName?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-100">{otherUserName}</p>
          {isAdminView && (
            <p className="text-[11px] text-neutral-500">Visitor</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5"
      >
        {isLoading ? (
          <p className="text-center text-sm text-neutral-500 pt-10">
            Loading messages...
          </p>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-neutral-500 pt-10">
            এখনো কোনো message নেই। কথা শুরু করো!
          </p>
        ) : (
          messages.map((m) => {
            const isMine = m.senderId === currentUserId;
            return (
              <div
                key={m.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm break-words ${
                    isMine
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-neutral-800 text-neutral-100 rounded-bl-sm"
                  }`}
                >
                  <p>{m.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMine ? "text-indigo-200/70" : "text-neutral-500"
                    }`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-neutral-800 bg-neutral-950/60 px-4 py-3"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message লিখো..."
          className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="submit"
          disabled={isSending || !text.trim()}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}