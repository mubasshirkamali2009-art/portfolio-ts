"use client";

import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area 
} from "recharts";

interface StatsData {
  totalProjects: number;
  totalCategories: number;
  top3Tech: { name: string; count: number }[];
  ratingData: { stars: string; count: number }[];
}

export default function StatsSection() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats"); 
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats chart:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="w-full max-w-6xl mx-auto my-8 p-12 text-center text-slate-500 animate-pulse bg-[#0B0F19]/40 border border-slate-900 rounded-3xl h-96 flex items-center justify-center">
        Compiling analytical metrics and chart calculations...
      </div>
    );
  }

  // ৩টি টেকনোলজির জন্য সুনির্দিষ্ট কালার অ্যারে (Red, Green, Yellow)
  const techColors = ["#F59E0B", "#3B82F6", "#F59E0B"];

  return (
    <section className="w-full max-w-6xl bg-[#0B0F19] border border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-2xl mx-auto my-8 relative overflow-hidden text-white">
      {/* Visual Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-blue-400 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider">Analytics Platform</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">System Statistics</h2>
        <p className="text-xs text-slate-400 mt-0.5">Real-time database records processing</p>
      </div>

      {/* Top 2 Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {/* Total Projects Card - Green Theme */}
        <div className="bg-[#111726]/50 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Projects</p>
            <h3 className="text-4xl font-extrabold mt-2 bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
              {stats.totalProjects}
            </h3>
          </div>
        </div>

        {/* Total Categories Card - Blue Theme */}
        <div className="bg-[#111726]/50 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Categories</p>
            <h3 className="text-4xl font-extrabold mt-2 bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
              {stats.totalCategories}
            </h3>
          </div>
        </div>
      </div>

      {/* Charts 2-Column Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Top 3 Tech Usage (Red, Green, Yellow) */}
        <div className="bg-[#111726]/30 border border-slate-800/50 rounded-2xl p-5 flex flex-col h-[320px]">
          <h4 className="text-sm font-semibold text-slate-300 mb-4">Top 3 Tech Usage (Core Stacks)</h4>
          <div className="w-full flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.top3Tech} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0B0F19", borderColor: "#1E293B", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.top3Tech.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={techColors[index % techColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Global Ratings Breakdown */}
        <div className="bg-[#111726]/30 border border-slate-800/50 rounded-2xl p-5 flex flex-col h-[320px]">
          <h4 className="text-sm font-semibold text-slate-300 mb-4">Reviews Matrix (1-5 Stars)</h4>
          <div className="w-full flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.ratingData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <XAxis dataKey="stars" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0B0F19", borderColor: "#1E293B", borderRadius: "12px", fontSize: "12px" }} />
                <defs>
                  <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="count" name="Total Reviews" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRating)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </section>
  );
}