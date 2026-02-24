import { useState } from "react";
import { Wand2, LayoutDashboard, FileText, Lightbulb, PanelLeftClose, PanelLeft } from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
          <Wand2 className="h-4 w-4 text-accent-foreground" />
        </div>
        {!collapsed && (
          <span className="font-display text-lg font-semibold text-sidebar-accent-foreground tracking-tight">
            PM Wizard
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        <SidebarNavItem to="/" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
        <SidebarNavItem to="/documents" icon={FileText} label="Documents" collapsed={collapsed} />
        <SidebarNavItem to="/insights" icon={Lightbulb} label="Insights" collapsed={collapsed} />
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors w-full"
        >
          {collapsed ? <PanelLeft className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
