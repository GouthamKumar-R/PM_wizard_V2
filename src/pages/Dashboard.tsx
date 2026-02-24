import { motion } from "framer-motion";
import { FileText, Lightbulb, MessageSquare, TrendingUp, Upload, ArrowRight, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocuments } from "@/hooks/useDocuments";
import { useInsights } from "@/hooks/useInsights";
import { useAuth } from "@/hooks/useAuth";

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
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Dashboard() {
  const { data: documents } = useDocuments();
  const { data: insights } = useInsights();
  const { signOut } = useAuth();

  const docCount = documents?.length || 0;
  const insightCount = insights?.length || 0;
  const feedbackCount = insights?.filter((i) => i.category === "feedback").length || 0;
  const categories = new Set(insights?.map((i) => i.category) || []);

  const stats = [
    { label: "Documents Ingested", value: String(docCount), icon: FileText, change: "Total uploaded" },
    { label: "Insights Generated", value: String(insightCount), icon: Lightbulb, change: "AI-generated" },
    { label: "Feedback Items", value: String(feedbackCount), icon: MessageSquare, change: "From documents" },
    { label: "Categories Active", value: String(categories.size), icon: TrendingUp, change: "Insight categories" },
  ];

  const recentInsights = (insights || []).slice(0, 4);

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Your product intelligence at a glance.</p>
        </div>
        <button onClick={signOut} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
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
        {recentInsights.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No insights yet. Upload documents to get started.</p>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {recentInsights.map((insight) => (
              <motion.div
                key={insight.id}
                variants={item}
                className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tagColors[insight.category] || ""}`}>
                    {tagLabels[insight.category] || insight.category}
                  </span>
                  <span className="text-[11px] text-muted-foreground ml-auto">
                    {new Date(insight.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{insight.summary}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
