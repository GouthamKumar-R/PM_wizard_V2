import { motion } from "framer-motion";
import { useState } from "react";
import { Lightbulb, MessageSquare, Rocket, BarChart3, Users, Filter, Search } from "lucide-react";

type Category = "all" | "feedback" | "suggestion" | "market" | "partner";

const categories: { key: Category; label: string; icon: typeof Lightbulb; color: string }[] = [
  { key: "all", label: "All", icon: Lightbulb, color: "" },
  { key: "feedback", label: "Current Design Feedback", icon: MessageSquare, color: "bg-category-feedback/10 text-category-feedback" },
  { key: "suggestion", label: "Future Release Suggestions", icon: Rocket, color: "bg-category-suggestion/10 text-category-suggestion" },
  { key: "market", label: "Market Intelligence", icon: BarChart3, color: "bg-category-market/10 text-category-market" },
  { key: "partner", label: "Partner Insights", icon: Users, color: "bg-category-partner/10 text-category-partner" },
];

const insights = [
  {
    id: 1,
    category: "feedback" as Category,
    title: "Navigation Complexity in Dashboard",
    summary: "73% of customer feedback mentions difficulty switching between views. Users expect a persistent sidebar or tabbed navigation rather than dropdown menus.",
    sources: ["Q4 Customer Survey", "Support Tickets #1204-1231"],
    confidence: 92,
    date: "Feb 22, 2026",
  },
  {
    id: 2,
    category: "feedback" as Category,
    title: "Mobile Responsiveness Issues",
    summary: "Field reports indicate 45% of enterprise users access the product on tablets during meetings. Current responsive breakpoints cause layout shifts on iPad Pro.",
    sources: ["Field Report - Enterprise Segment"],
    confidence: 87,
    date: "Feb 21, 2026",
  },
  {
    id: 3,
    category: "suggestion" as Category,
    title: "AI-Powered Ticket Categorization",
    summary: "Implementing auto-categorization of support tickets could reduce PM triage time by 40%. Partner team analysis suggests using existing taxonomy as training data.",
    sources: ["Partner Feedback Q1", "Sales Call - Acme Corp"],
    confidence: 78,
    date: "Feb 20, 2026",
  },
  {
    id: 4,
    category: "suggestion" as Category,
    title: "Bulk Export & API Access",
    summary: "Enterprise clients are requesting programmatic access to generated insights. RESTful API with webhook support for real-time insight delivery recommended.",
    sources: ["Sales Call - Acme Corp", "Partner Feedback Q1"],
    confidence: 85,
    date: "Feb 19, 2026",
  },
  {
    id: 5,
    category: "market" as Category,
    title: "PM Tooling Market Growth",
    summary: "Gartner reports 28% YoY increase in demand for AI-integrated PM tools. Companies with AI-driven insights see 2.3x faster release cycles on average.",
    sources: ["Gartner MQ 2026"],
    confidence: 95,
    date: "Feb 18, 2026",
  },
  {
    id: 6,
    category: "market" as Category,
    title: "Competitive Landscape Shift",
    summary: "IDC forecasts consolidation in the PM tools market. Top 3 vendors are acquiring AI startups. Differentiation through RAG-based insights is a key advantage.",
    sources: ["IDC Market Forecast 2026"],
    confidence: 88,
    date: "Feb 17, 2026",
  },
  {
    id: 7,
    category: "partner" as Category,
    title: "Integration Demand from Sales",
    summary: "Sales team reports 60% of prospect demos include questions about Jira and Linear integrations. Two-way sync is the most requested feature.",
    sources: ["Partner Feedback Q1", "Field Report"],
    confidence: 82,
    date: "Feb 16, 2026",
  },
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

  const filtered = insights.filter((i) => {
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
        {/* Search */}
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

        {/* Category pills */}
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
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tagColors[insight.category]}`}>
                    {tagLabels[insight.category]}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{insight.date}</span>
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
            No insights match your filters.
          </div>
        )}
      </motion.div>
    </div>
  );
}
