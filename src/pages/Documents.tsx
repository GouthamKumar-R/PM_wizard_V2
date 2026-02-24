import { motion } from "framer-motion";
import { Upload, FileText, FileSpreadsheet, Mic, BarChart3, Users } from "lucide-react";
import { useState, useRef } from "react";
import { useDocuments, useUploadDocument } from "@/hooks/useDocuments";
import { format } from "date-fns";

const sourceTypes = [
  { key: "customer_feedback", label: "Customer Feedback", icon: Users, description: "Support tickets, surveys, NPS" },
  { key: "field_reports", label: "Field Reports", icon: FileText, description: "Sales & CS field observations" },
  { key: "analyst_transcripts", label: "Analyst Transcripts", icon: Mic, description: "Call recordings & transcripts" },
  { key: "market_reports", label: "Market Reports", icon: BarChart3, description: "Gartner, IDC, Forrester" },
  { key: "partner_insights", label: "Partner Insights", icon: FileSpreadsheet, description: "Partner team documents" },
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
  const [selectedSource, setSelectedSource] = useState("customer_feedback");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: documents, isLoading } = useDocuments();
  const uploadMutation = useUploadDocument();

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      uploadMutation.mutate({ file, sourceType: selectedSource });
    });
  };

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
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          accept=".pdf,.docx,.xlsx,.mp3,.txt,.md,.csv,.json,.xml"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Upload className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-display font-semibold text-sm">Drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOCX, XLSX, MP3, TXT — up to 20MB per file
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="mt-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium text-sm shadow-[var(--shadow-amber)] hover:brightness-105 transition disabled:opacity-50"
          >
            {uploadMutation.isPending ? "Uploading..." : "Browse Files"}
          </button>
        </div>
      </motion.div>

      {/* Source types */}
      <div className="mb-10">
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Source Type (for upload)</h2>
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {sourceTypes.map((s) => (
            <motion.div
              key={s.key}
              variants={item}
              onClick={() => setSelectedSource(s.key)}
              className={`rounded-xl border p-4 text-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow cursor-pointer group ${
                selectedSource === s.key ? "border-accent bg-accent/5" : "bg-card"
              }`}
            >
              <s.icon className={`h-5 w-5 mx-auto mb-2 transition-colors ${
                selectedSource === s.key ? "text-accent" : "text-muted-foreground group-hover:text-accent"
              }`} />
              <p className="font-display text-xs font-semibold">{s.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Documents list */}
      <div>
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Uploaded Documents</h2>
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Loading documents...</div>
        ) : !documents?.length ? (
          <div className="text-sm text-muted-foreground py-8 text-center">No documents uploaded yet. Upload your first document above.</div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="rounded-xl border bg-card overflow-hidden shadow-[var(--shadow-card)]">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider border-b">
              <span>Name</span>
              <span>Type</span>
              <span>Date</span>
              <span>Status</span>
            </div>
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                variants={item}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3.5 text-sm items-center border-b last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                <span className="font-medium truncate">{doc.name}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{doc.source_type.replace(/_/g, " ")}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(doc.created_at), "MMM d, yyyy")}</span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                  doc.status === "processed"
                    ? "bg-category-suggestion/10 text-category-suggestion"
                    : doc.status === "error"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-accent/10 text-accent"
                }`}>
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
