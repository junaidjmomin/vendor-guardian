import { Eye, LayoutDashboard, Building2, Bell, GitBranch, Shield, FileText, Network, Settings } from "lucide-react";
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
  { title: "Alerts", url: "/alerts", icon: Bell },
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

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="p-4 pb-6">
        <div className="flex items-center gap-3">
          <img src={logoIcon} alt="Third Eye" className="h-8 w-8 rounded-lg" />
          {!collapsed && (
            <div>
              <h1 className="text-sm font-display font-bold text-foreground tracking-tight">Third Eye</h1>
              <p className="text-[10px] text-muted-foreground font-display tracking-wide">Risk Intelligence</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest text-muted-foreground font-display">OPERATIONS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent rounded-lg transition-all" activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="font-display text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest text-muted-foreground font-display">REGULATORY</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {complianceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent rounded-lg transition-all" activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="font-display text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest text-muted-foreground font-display">ADVANCED</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {advancedItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent rounded-lg transition-all" activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="font-display text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="rounded-xl border border-border/50 bg-secondary/30 p-3 text-[10px]">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-risk-stable animate-pulse" />
              <span className="text-muted-foreground font-display">System Online</span>
            </div>
            <p className="mt-1 text-muted-foreground">Last scan: 2 min ago</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}