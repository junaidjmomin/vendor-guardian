import { LayoutDashboard, Building2, Bell, GitBranch, Shield, FileText, Network, Settings, Sparkles, Zap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Command Center", url: "/dashboard", icon: LayoutDashboard },
  { title: "Vendor Registry", url: "/vendors", icon: Building2 },
  { title: "Alerts", url: "/alerts", icon: Bell, badge: 3 },
  { title: "Workflows", url: "/workflows", icon: GitBranch },
];

const complianceItems = [
  { title: "Compliance", url: "/compliance", icon: Shield },
  { title: "Reports", url: "/reports", icon: FileText },
];

const advancedItems = [
  { title: "Consortium", url: "/consortium", icon: Network },
  { title: "Settings", url: "/settings", icon: Settings },
];

function NavSection({ label, items, collapsed }: { label: string; items: typeof mainItems; collapsed: boolean }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(path));

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[9px] tracking-[0.25em] text-muted-foreground/40 font-body font-bold mb-1">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = isActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active}>
                  <NavLink
                    to={item.url}
                    end
                    className={`relative rounded-xl transition-all duration-200 group ${
                      active ? "bg-primary/6 text-foreground" : "hover:bg-secondary/25 text-muted-foreground hover:text-foreground"
                    }`}
                    activeClassName=""
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-4 rounded-r-full bg-primary" />
                    )}
                    <item.icon className={`h-[17px] w-[17px] ${active ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"} transition-colors`} />
                    {!collapsed && (
                      <span className={`font-body text-[13px] ${active ? "font-semibold" : "font-medium"}`}>
                        {item.title}
                      </span>
                    )}
                    {!collapsed && 'badge' in item && item.badge && (
                      <span className="ml-auto rounded-md bg-risk-high/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-risk-high">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/20">
      <SidebarHeader className="p-4 pb-7">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={logoIcon} alt="Third Eye" className="h-9 w-9 rounded-xl" />
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-risk-stable border-2 border-sidebar-background" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-display font-extrabold text-foreground tracking-tight leading-none">Third Eye</h1>
              <p className="text-[9px] text-muted-foreground/40 font-body tracking-[0.2em] mt-1 font-bold">RISK INTELLIGENCE</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <NavSection label="OPERATIONS" items={mainItems} collapsed={collapsed} />
        <NavSection label="REGULATORY" items={complianceItems} collapsed={collapsed} />
        <NavSection label="ADVANCED" items={advancedItems} collapsed={collapsed} />
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="bento-card !p-3.5 !rounded-2xl">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary/8 border border-primary/8 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[11px] font-display font-bold text-foreground">AI Engine</p>
                <p className="text-[9px] text-muted-foreground/50 mt-0.5 font-body">Scan: 2 min ago</p>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
