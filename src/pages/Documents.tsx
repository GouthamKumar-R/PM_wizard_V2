import { motion } from "framer-motion";
import { Upload, FileText, FileSpreadsheet, Mic, BarChart3, Users, X } from "lucide-react";
import { useState } from "react";

const sourceTypes = [
  { label: "Customer Feedback", icon: Users, description: "Support tickets, surveys, NPS" },
  { label: "Field Reports", icon: FileText, description: "Sales & CS field observations" },
  { label: "Analyst Transcripts", icon: Mic, description: "Call recordings & transcripts" },
  { label: "Market Reports", icon: BarChart3, description: "Gartner, IDC, Forrester" },
  { label: "Partner Insights", icon: FileSpreadsheet, description: "Partner team documents" },
];

const existingDocs = [
  { name: "Q4 Customer Survey Results.pdf", type: "Customer Feedback", date: "Feb 20, 2026", status: "Processed" },
  { name: "Gartner MQ 2026 - PM Tools.pdf", type: "Market Reports", date: "Feb 18, 2026", status: "Processed" },
  { name: "Sales Call - Acme Corp.mp3", type: "Analyst Transcripts", date: "Feb 15, 2026", status: "Processed" },
  { name: "Partner Feedback - Q1.xlsx", type: "Partner Insights", date: "Feb 12, 2026", status: "Processed" },
  { name: "Field Report - Enterprise Segment.docx", type: "Field Reports", date: "Feb 10, 2026", status: "Processed" },
  { name: "IDC Market Forecast 2026.pdf", type: "Market Reports", date: "Feb 8, 2026", status: "Processing" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function Documents() {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground mt-1 text-sm">Upload and manage your data sources.</p>
      </motion.div>

      {/* Upload area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-xl border-2 border-dashed p-10 text-center mb-8 transition-colors ${
          dragOver ? "border-accent bg-accent/5" : "border-border"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Upload className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-display font-semibold text-sm">Drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOCX, XLSX, MP3, TXT — up to 50MB per file
            </p>
          </div>
          <button className="mt-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium text-sm shadow-[var(--shadow-amber)] hover:brightness-105 transition">
            Browse Files
          </button>
        </div>
      </motion.div>

      {/* Source types */}
      <div className="mb-10">
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Source Types</h2>
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {sourceTypes.map((s) => (
            <motion.div
              key={s.label}
              variants={item}
              className="rounded-xl border bg-card p-4 text-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow cursor-pointer group"
            >
              <s.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground group-hover:text-accent transition-colors" />
              <p className="font-display text-xs font-semibold">{s.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Existing documents */}
      <div>
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Uploaded Documents</h2>
        <motion.div variants={container} initial="hidden" animate="show" className="rounded-xl border bg-card overflow-hidden shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider border-b">
            <span>Name</span>
            <span>Type</span>
            <span>Date</span>
            <span>Status</span>
          </div>
          {existingDocs.map((doc, i) => (
            <motion.div
              key={i}
              variants={item}
              className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3.5 text-sm items-center border-b last:border-b-0 hover:bg-muted/30 transition-colors"
            >
              <span className="font-medium truncate">{doc.name}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{doc.type}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{doc.date}</span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                doc.status === "Processed"
                  ? "bg-category-suggestion/10 text-category-suggestion"
                  : "bg-accent/10 text-accent"
              }`}>
                {doc.status}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
