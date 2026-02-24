import { useState } from "react";
import { Cpu, LayoutDashboard, FileText, Lightbulb, PanelLeftClose, PanelLeft, Zap } from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-cyan-500/10 bg-slate-950 transition-all duration-300 shrink-0 overflow-hidden",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

      {/* Logo */}
      <div className="relative flex items-center gap-3 px-4 py-5 border-b border-cyan-500/10">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 animate-pulse-glow">
          <Cpu className="h-4 w-4 text-cyan-400" />
          <div className="absolute inset-0 rounded-lg bg-cyan-500/5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-cyber text-sm font-bold text-cyan-400 tracking-wider text-glow-cyan">PM WIZARD</span>
            <span className="text-[10px] text-slate-500 tracking-widest uppercase flex items-center gap-1">
              <Zap className="h-2.5 w-2.5 text-cyan-600" />
              AI Insights Engine
            </span>
          </div>
        )}
      </div>

      {/* Status indicator */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-cyan-500/5 border border-cyan-500/15 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] text-cyan-500 tracking-widest uppercase">Systems Online</span>
        </div>
      )}

      {/* Nav */}
      <nav className="relative flex-1 flex flex-col gap-1 px-3 py-4">
        <SidebarNavItem to="/" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
        <SidebarNavItem to="/documents" icon={FileText} label="Documents" collapsed={collapsed} />
        <SidebarNavItem to="/insights" icon={Lightbulb} label="Insights" collapsed={collapsed} />
      </nav>

      {/* Bottom glow line */}
      <div className="absolute bottom-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Collapse toggle */}
      <div className="relative px-3 py-3 border-t border-cyan-500/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5 hover:border-cyan-500/20 border border-transparent transition-all duration-300 w-full"
        >
          {collapsed ? <PanelLeft className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
          {!collapsed && <span className="tracking-wide text-xs uppercase">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

