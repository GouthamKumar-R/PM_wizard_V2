import { motion } from "framer-motion";
import { Upload, FileText, FileSpreadsheet, Mic, BarChart3, Users, CloudUpload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useDocuments, useUploadDocument } from "@/hooks/useDocuments";
import { format } from "date-fns";

const sourceTypes = [
  { key: "customer_feedback", label: "Customer Feedback", icon: Users, description: "Surveys, NPS, tickets", color: "cyan" },
  { key: "field_reports", label: "Field Reports", icon: FileText, description: "Sales & CS observations", color: "purple" },
  { key: "analyst_transcripts", label: "Analyst Transcripts", icon: Mic, description: "Call recordings", color: "pink" },
  { key: "market_reports", label: "Market Reports", icon: BarChart3, description: "Gartner, IDC, Forrester", color: "amber" },
  { key: "partner_insights", label: "Partner Insights", icon: FileSpreadsheet, description: "Partner documents", color: "emerald" },
];

const sourceColors: Record<string, { border: string; bg: string; text: string; activeBorder: string; activeBg: string }> = {
  cyan:    { border: "border-slate-700", bg: "bg-slate-900/60", text: "text-cyan-400",    activeBorder: "border-cyan-500/50",    activeBg: "bg-cyan-500/10" },
  purple:  { border: "border-slate-700", bg: "bg-slate-900/60", text: "text-purple-400",  activeBorder: "border-purple-500/50",  activeBg: "bg-purple-500/10" },
  pink:    { border: "border-slate-700", bg: "bg-slate-900/60", text: "text-pink-400",    activeBorder: "border-pink-500/50",    activeBg: "bg-pink-500/10" },
  amber:   { border: "border-slate-700", bg: "bg-slate-900/60", text: "text-amber-400",   activeBorder: "border-amber-500/50",   activeBg: "bg-amber-500/10" },
  emerald: { border: "border-slate-700", bg: "bg-slate-900/60", text: "text-emerald-400", activeBorder: "border-emerald-500/50", activeBg: "bg-emerald-500/10" },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

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
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-cyber text-cyan-500 tracking-widest uppercase">// Data Ingestion</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <h1 className="font-cyber text-3xl font-bold gradient-text tracking-wide">DOCUMENTS</h1>
        <p className="text-slate-500 mt-1 text-sm">Upload and manage your intelligence sources.</p>
      </motion.div>

      {/* Source type selector */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="font-cyber text-xs font-semibold text-slate-500 uppercase tracking-widest">// Select Source Type</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
        </div>
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {sourceTypes.map((s) => {
            const c = sourceColors[s.color];
            const active = selectedSource === s.key;
            return (
              <motion.div
                key={s.key}
                variants={item}
                onClick={() => setSelectedSource(s.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`rounded-xl border p-4 text-center cursor-pointer transition-all duration-200 ${
                  active ? `${c.activeBorder} ${c.activeBg}` : `${c.border} ${c.bg} hover:${c.activeBorder}`
                }`}
              >
                <s.icon className={`h-5 w-5 mx-auto mb-2 ${active ? c.text : "text-slate-600 group-hover:" + c.text}`} />
                <p className={`font-display text-xs font-semibold ${active ? "text-white" : "text-slate-400"}`}>{s.label}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{s.description}</p>
                {active && <div className={`mt-2 h-0.5 rounded-full bg-gradient-to-r from-transparent via-current to-transparent ${c.text}`} />}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Upload area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`relative rounded-xl border-2 border-dashed p-10 text-center mb-10 transition-all duration-300 overflow-hidden ${
          dragOver
            ? "border-cyan-400 bg-cyan-500/5 shadow-[0_0_30px_rgba(34,211,238,0.1)]"
            : "border-slate-700 hover:border-cyan-500/40 hover:bg-cyan-500/3"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        {dragOver && (
          <div className="absolute inset-0 animate-scan-line pointer-events-none" />
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          accept=".pdf,.docx,.xlsx,.mp3,.txt,.md,.csv,.json,.xml"
        />
        <div className="flex flex-col items-center gap-3">
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-all duration-300 ${
            dragOver ? "border-cyan-400 bg-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.3)]" : "border-slate-700 bg-slate-800/50"
          }`}>
            <CloudUpload className={`h-6 w-6 transition-colors ${dragOver ? "text-cyan-400" : "text-slate-500"}`} />
          </div>
          <div>
            <p className="font-display font-semibold text-sm text-white">
              {dragOver ? "Release to upload" : "Drop files here or click to browse"}
            </p>
            <p className="text-xs text-slate-500 mt-1">PDF, DOCX, XLSX, MP3, TXT — up to 20MB per file</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="mt-1 px-5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium text-sm hover:bg-cyan-500/20 hover:border-cyan-500/60 hover:shadow-[0_0_16px_rgba(34,211,238,0.2)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploadMutation.isPending ? (
              <span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…</span>
            ) : (
              <span className="flex items-center gap-2"><Upload className="h-3.5 w-3.5" /> Browse Files</span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Documents list */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-cyber text-xs font-semibold text-slate-500 uppercase tracking-widest">// Uploaded Documents</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
          {documents && (
            <span className="font-cyber text-[10px] text-slate-600">{documents.length} files</span>
          )}
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-cyber tracking-wider">LOADING DOCUMENTS…</span>
          </div>
        ) : !documents?.length ? (
          <div className="text-center py-16 rounded-xl border border-dashed border-slate-800">
            <FileText className="h-8 w-8 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-600">No documents uploaded yet. Upload your first document above.</p>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 text-[10px] font-cyber text-slate-600 uppercase tracking-widest border-b border-slate-800 bg-slate-900/40">
              <span>File Name</span>
              <span>Source</span>
              <span>Uploaded</span>
              <span>Status</span>
            </div>
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                variants={item}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3.5 text-sm items-center border-b border-slate-800/60 last:border-b-0 hover:bg-slate-800/30 transition-colors group"
              >
                <span className="font-medium text-slate-300 truncate group-hover:text-white transition-colors">{doc.name}</span>
                <span className="text-[11px] text-slate-600 whitespace-nowrap capitalize">{doc.source_type.replace(/_/g, " ")}</span>
                <span className="text-[11px] text-slate-600 whitespace-nowrap">{format(new Date(doc.created_at), "MMM d, yyyy")}</span>
                <span className={`flex items-center gap-1.5 text-[10px] font-cyber font-medium px-2.5 py-1 rounded-full whitespace-nowrap border ${
                  doc.status === "processed"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : doc.status === "error"
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }`}>
                  {doc.status === "processed" && <CheckCircle2 className="h-3 w-3" />}
                  {doc.status === "error" && <AlertCircle className="h-3 w-3" />}
                  {doc.status === "processing" && <Loader2 className="h-3 w-3 animate-spin" />}
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
