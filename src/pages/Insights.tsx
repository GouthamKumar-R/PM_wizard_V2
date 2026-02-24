import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Lightbulb, MessageSquare, Rocket, BarChart3, Users, Search, Brain, Loader2 } from "lucide-react";
import { useInsights } from "@/hooks/useInsights";
import { format } from "date-fns";

type Category = "all" | "feedback" | "suggestion" | "market" | "partner";

const categories: { key: Category; label: string; icon: typeof Lightbulb; color: string; activeBg: string; activeBorder: string; activeText: string }[] = [
  { key: "all",        label: "All",               icon: Lightbulb,    color: "text-slate-400",   activeBg: "bg-slate-700/60",       activeBorder: "border-slate-500",       activeText: "text-white" },
  { key: "feedback",   label: "Design Feedback",   icon: MessageSquare, color: "text-cyan-400",    activeBg: "bg-cyan-500/10",        activeBorder: "border-cyan-500/50",     activeText: "text-cyan-300" },
  { key: "suggestion", label: "Future Releases",   icon: Rocket,        color: "text-purple-400",  activeBg: "bg-purple-500/10",      activeBorder: "border-purple-500/50",   activeText: "text-purple-300" },
  { key: "market",     label: "Market Intelligence",icon: BarChart3,    color: "text-pink-400",    activeBg: "bg-pink-500/10",        activeBorder: "border-pink-500/50",     activeText: "text-pink-300" },
  { key: "partner",    label: "Partner Insights",  icon: Users,         color: "text-emerald-400", activeBg: "bg-emerald-500/10",     activeBorder: "border-emerald-500/50",  activeText: "text-emerald-300" },
];

const tagStyles: Record<string, { badge: string; border: string; bar: string; confidence: string }> = {
  feedback:   { badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",    border: "border-l-cyan-500",    bar: "bg-gradient-to-r from-cyan-500 to-cyan-400",    confidence: "text-cyan-400" },
  suggestion: { badge: "bg-purple-500/10 text-purple-400 border-purple-500/30", border: "border-l-purple-500", bar: "bg-gradient-to-r from-purple-500 to-purple-400", confidence: "text-purple-400" },
  market:     { badge: "bg-pink-500/10 text-pink-400 border-pink-500/30",    border: "border-l-pink-500",    bar: "bg-gradient-to-r from-pink-500 to-pink-400",    confidence: "text-pink-400" },
  partner:    { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", border: "border-l-emerald-500", bar: "bg-gradient-to-r from-emerald-500 to-emerald-400", confidence: "text-emerald-400" },
};

const tagLabels: Record<string, string> = {
  feedback: "Design Feedback",
  suggestion: "Future Release",
  market: "Market Intel",
  partner: "Partner Insight",
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const cardItem = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function Insights() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: insights, isLoading } = useInsights();

  const filtered = (insights || []).filter((i) => {
    const matchCategory = activeCategory === "all" || i.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-cyber text-purple-500 tracking-widest uppercase">// AI Intelligence</span>
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        </div>
        <h1 className="font-cyber text-3xl font-bold gradient-text tracking-wide">INSIGHTS</h1>
        <p className="text-slate-500 mt-1 text-sm">AI-generated summaries extracted from your data sources.</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
          <input
            type="text"
            placeholder="Search insights…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/60 pl-10 pr-4 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_12px_rgba(34,211,238,0.1)] transition-all"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  active
                    ? `${cat.activeBg} ${cat.activeBorder} ${cat.activeText}`
                    : "bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                }`}
              >
                <cat.icon className={`h-3 w-3 ${active ? cat.color : ""}`} />
                {cat.label}
                {active && insights && (
                  <span className="ml-0.5 font-cyber text-[9px] opacity-70">
                    {activeCategory === "all" ? insights.length : insights.filter((i) => i.category === activeCategory).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-cyber tracking-wider">LOADING INSIGHTS…</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchQuery}
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {filtered.map((insight) => {
              const style = tagStyles[insight.category] || tagStyles["feedback"];
              return (
                <motion.div
                  key={insight.id}
                  variants={cardItem}
                  whileHover={{ x: 3 }}
                  className={`rounded-xl bg-slate-900/70 border border-slate-800 border-l-2 ${style.border} hover:border-slate-700 hover:bg-slate-900/90 p-5 transition-all duration-300 group`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-cyber font-medium px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                        {tagLabels[insight.category] || insight.category}
                      </span>
                      <span className="text-[10px] text-slate-600 font-cyber">
                        {format(new Date(insight.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    {/* Confidence */}
                    <div className="shrink-0 text-right">
                      <div className="text-[9px] text-slate-600 font-cyber uppercase tracking-widest mb-1">Confidence</div>
                      <div className={`font-cyber font-bold text-sm ${style.confidence}`}>{insight.confidence}%</div>
                      <div className="mt-1 w-16 h-1 rounded-full bg-slate-800 overflow-hidden ml-auto">
                        <div
                          className={`h-full rounded-full ${style.bar} shadow-[0_0_6px_currentColor]`}
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-semibold text-[15px] text-white mb-2 group-hover:text-white transition-colors">
                    {insight.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-sm text-slate-400 leading-relaxed mb-3 group-hover:text-slate-300 transition-colors">
                    {insight.summary}
                  </p>

                  {/* Sources */}
                  {insight.sources?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {insight.sources.map((source) => (
                        <span key={source} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-500 font-cyber border border-slate-700">
                          {source}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-20 rounded-xl border border-dashed border-slate-800">
                <Brain className="h-8 w-8 text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-600">
                  {insights?.length === 0
                    ? "No insights yet. Upload documents to generate AI insights."
                    : "No insights match your filters."}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
