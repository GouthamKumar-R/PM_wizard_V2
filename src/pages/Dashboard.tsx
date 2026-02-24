import { motion } from "framer-motion";
import { FileText, Lightbulb, MessageSquare, TrendingUp, Upload, ArrowRight, Brain, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocuments } from "@/hooks/useDocuments";
import { useInsights } from "@/hooks/useInsights";

const tagColors: Record<string, string> = {
  feedback: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  suggestion: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  market: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  partner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

const tagLabels: Record<string, string> = {
  feedback: "Design Feedback",
  suggestion: "Future Release",
  market: "Market Intel",
  partner: "Partner Insight",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const { data: documents } = useDocuments();
  const { data: insights } = useInsights();

  const docCount = documents?.length || 0;
  const insightCount = insights?.length || 0;
  const feedbackCount = insights?.filter((i) => i.category === "feedback").length || 0;
  const categories = new Set(insights?.map((i) => i.category) || []);

  const stats = [
    { label: "Documents Ingested", value: String(docCount), icon: FileText, color: "cyan", glow: "shadow-[0_0_20px_rgba(34,211,238,0.15)]", border: "border-cyan-500/20", iconColor: "text-cyan-400" },
    { label: "Insights Generated", value: String(insightCount), icon: Brain, color: "purple", glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]", border: "border-purple-500/20", iconColor: "text-purple-400" },
    { label: "Feedback Items", value: String(feedbackCount), icon: MessageSquare, color: "pink", glow: "shadow-[0_0_20px_rgba(236,72,153,0.15)]", border: "border-pink-500/20", iconColor: "text-pink-400" },
    { label: "Categories Active", value: String(categories.size), icon: Activity, color: "emerald", glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]", border: "border-emerald-500/20", iconColor: "text-emerald-400" },
  ];

  const recentInsights = (insights || []).slice(0, 4);

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-cyber text-cyan-500 tracking-widest uppercase">// AI Command Center</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <h1 className="font-cyber text-3xl font-bold gradient-text tracking-wide">DASHBOARD</h1>
        <p className="text-slate-500 mt-1 text-sm">Real-time product intelligence — powered by AI.</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`relative rounded-xl bg-slate-900/80 border ${s.border} p-5 ${s.glow} transition-all duration-300 overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-2xl bg-current" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.iconColor}`} />
            </div>
            <p className={`font-cyber text-4xl font-bold ${s.iconColor} drop-shadow-[0_0_8px_currentColor]`}>{s.value}</p>
            <div className="mt-2 h-px bg-gradient-to-r from-current to-transparent opacity-20" />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <motion.div variants={item}>
          <Link
            to="/documents"
            className="flex items-center gap-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 p-5 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)] transition-all duration-300 group"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-colors">
              <Upload className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-sm text-white">Upload Documents</p>
              <p className="text-xs text-slate-500">Ingest feedback, reports & transcripts</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>
        <motion.div variants={item}>
          <Link
            to="/insights"
            className="flex items-center gap-4 rounded-xl bg-slate-900/80 border border-purple-500/20 p-5 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.12)] transition-all duration-300 group"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/30 group-hover:bg-purple-500/20 transition-colors">
              <Lightbulb className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-sm text-white">View Insights</p>
              <p className="text-xs text-slate-500">Browse AI-generated summaries</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Recent insights */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-cyber text-sm font-semibold text-slate-400 uppercase tracking-widest">// Recent Insights</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 to-transparent" />
        </div>
        {recentInsights.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-slate-800">
            <Brain className="h-8 w-8 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-600">No insights yet. Upload documents to get started.</p>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {recentInsights.map((insight) => (
              <motion.div
                key={insight.id}
                variants={item}
                whileHover={{ x: 4 }}
                className="rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/20 p-5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${tagColors[insight.category] || ""}`}>
                    {tagLabels[insight.category] || insight.category}
                  </span>
                  <span className="text-[10px] text-slate-600 ml-auto font-cyber">
                    {new Date(insight.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">{insight.summary}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
