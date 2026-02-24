import { motion } from "framer-motion";
import { FileText, Lightbulb, MessageSquare, TrendingUp, Upload, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Documents Ingested", value: "128", icon: FileText, change: "+12 this week" },
  { label: "Insights Generated", value: "47", icon: Lightbulb, change: "+8 this week" },
  { label: "Feedback Items", value: "312", icon: MessageSquare, change: "+23 this week" },
  { label: "Trends Identified", value: "15", icon: TrendingUp, change: "+3 this week" },
];

const recentInsights = [
  {
    category: "Current Design Feedback",
    summary: "Users report difficulty navigating between dashboard views. 73% of feedback mentions improved filtering as a top request.",
    tag: "feedback",
    time: "2 hours ago",
  },
  {
    category: "Suggestions for Future Releases",
    summary: "AI-powered auto-categorization of support tickets could reduce PM triage time by 40%, based on partner team analysis.",
    tag: "suggestion",
    time: "5 hours ago",
  },
  {
    category: "Market Intelligence",
    summary: "Gartner's latest report highlights a 28% YoY increase in demand for integrated PM tooling with AI capabilities.",
    tag: "market",
    time: "1 day ago",
  },
  {
    category: "Partner Insights",
    summary: "Sales team reports enterprise clients requesting bulk export and API access for generated insights.",
    tag: "partner",
    time: "2 days ago",
  },
];

const tagColors: Record<string, string> = {
  feedback: "bg-category-feedback/10 text-category-feedback",
  suggestion: "bg-category-suggestion/10 text-category-suggestion",
  market: "bg-category-market/10 text-category-market",
  partner: "bg-category-partner/10 text-category-partner",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Your product intelligence at a glance.</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-display text-3xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <motion.div variants={item}>
          <Link
            to="/documents"
            className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Upload className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-sm">Upload Documents</p>
              <p className="text-xs text-muted-foreground">Ingest feedback, reports & transcripts</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        </motion.div>
        <motion.div variants={item}>
          <Link
            to="/insights"
            className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Lightbulb className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-sm">View Insights</p>
              <p className="text-xs text-muted-foreground">Browse AI-generated summaries</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Recent insights */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Recent Insights</h2>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {recentInsights.map((insight, i) => (
            <motion.div
              key={i}
              variants={item}
              className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tagColors[insight.tag]}`}>
                  {insight.category}
                </span>
                <span className="text-[11px] text-muted-foreground ml-auto">{insight.time}</span>
              </div>
              <p className="text-sm leading-relaxed">{insight.summary}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
