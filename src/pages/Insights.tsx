import { motion } from "framer-motion";
import { useState } from "react";
import { Lightbulb, MessageSquare, Rocket, BarChart3, Users, Search } from "lucide-react";
import { useInsights } from "@/hooks/useInsights";
import { format } from "date-fns";

type Category = "all" | "feedback" | "suggestion" | "market" | "partner";

const categories: { key: Category; label: string; icon: typeof Lightbulb }[] = [
  { key: "all", label: "All", icon: Lightbulb },
  { key: "feedback", label: "Design Feedback", icon: MessageSquare },
  { key: "suggestion", label: "Future Releases", icon: Rocket },
  { key: "market", label: "Market Intelligence", icon: BarChart3 },
  { key: "partner", label: "Partner Insights", icon: Users },
];

const tagColors: Record<string, string> = {
  feedback: "bg-category-feedback/10 text-category-feedback",
  suggestion: "bg-category-suggestion/10 text-category-suggestion",
  market: "bg-category-market/10 text-category-market",
  partner: "bg-category-partner/10 text-category-partner",
};

const tagLabels: Record<string, string> = {
  feedback: "Design Feedback",
  suggestion: "Future Release",
  market: "Market Intel",
  partner: "Partner Insight",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function Insights() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: insights, isLoading } = useInsights();

  const filtered = (insights || []).filter((i) => {
    const matchCategory = activeCategory === "all" || i.category === activeCategory;
    const matchSearch = !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground mt-1 text-sm">AI-generated summaries from your data sources.</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.key
                  ? "bg-foreground text-background"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              <cat.icon className="h-3 w-3" />
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      {isLoading ? (
        <div className="text-sm text-muted-foreground py-16 text-center">Loading insights...</div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" key={activeCategory + searchQuery} className="space-y-4">
          {filtered.map((insight) => (
            <motion.div
              key={insight.id}
              variants={item}
              className="rounded-xl border bg-card p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tagColors[insight.category] || ""}`}>
                      {tagLabels[insight.category] || insight.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{format(new Date(insight.created_at), "MMM d, yyyy")}</span>
                  </div>
                  <h3 className="font-display font-semibold text-[15px]">{insight.title}</h3>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[11px] text-muted-foreground mb-0.5">Confidence</div>
                  <div className="font-display font-bold text-sm">{insight.confidence}%</div>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-3">{insight.summary}</p>
              <div className="flex flex-wrap gap-1.5">
                {insight.sources.map((source) => (
                  <span key={source} className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                    {source}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              {insights?.length === 0 ? "No insights yet. Upload documents to generate AI insights." : "No insights match your filters."}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
