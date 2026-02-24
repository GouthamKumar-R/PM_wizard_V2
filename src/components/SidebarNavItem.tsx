import { NavLink as RouterNavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  collapsed?: boolean;
}

export function SidebarNavItem({ to, icon: Icon, label, collapsed }: SidebarNavItemProps) {
  return (
    <RouterNavLink
      to={to}
      end
      className={({ isActive }) =>
        [
          "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 group overflow-hidden",
          isActive
            ? "bg-cyan-500/10 text-cyan-400 font-medium border border-cyan-500/30"
            : "text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/20",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-0 h-full w-0.5 bg-cyan-400 rounded-r-full" />
          )}
          <Icon className={`h-[18px] w-[18px] shrink-0 transition-all duration-300 ${
            isActive ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" : "group-hover:text-cyan-300"
          }`} />
          {!collapsed && <span className="tracking-wide">{label}</span>}
          {isActive && !collapsed && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          )}
        </>
      )}
    </RouterNavLink>
  );
}

