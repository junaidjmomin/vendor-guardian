import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AnimatePresence } from "framer-motion";
import { Search, Bell, User } from "lucide-react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import VendorRegistry from "./pages/VendorRegistry";
import VendorDetail from "./pages/VendorDetail";
import AlertsPage from "./pages/AlertsPage";
import WorkflowsPage from "./pages/WorkflowsPage";
import CompliancePage from "./pages/CompliancePage";
import ReportsPage from "./pages/ReportsPage";
import ConsortiumPage from "./pages/ConsortiumPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const pageTitles: Record<string, string> = {
  "/dashboard": "Command Center",
  "/vendors": "Vendor Registry",
  "/alerts": "Alerts",
  "/workflows": "Workflows",
  "/compliance": "Compliance",
  "/reports": "Reports",
  "/consortium": "Consortium",
  "/settings": "Settings",
};

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vendors" element={<VendorRegistry />} />
        <Route path="/vendors/:id" element={<VendorDetail />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/workflows" element={<WorkflowsPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/consortium" element={<ConsortiumPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function TopBar() {
  const location = useLocation();
  const basePath = "/" + location.pathname.split("/")[1];
  const title = pageTitles[basePath] || "";

  return (
    <header className="h-14 flex items-center border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-10">
      <SidebarTrigger className="ml-3" />
      
      {title && (
        <div className="ml-4 hidden sm:flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground font-display">/</span>
          <span className="text-sm font-display font-medium text-foreground">{title}</span>
        </div>
      )}

      <div className="ml-auto mr-4 flex items-center gap-1.5">
        {/* Search */}
        <button className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button className="relative h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-risk-high animate-pulse" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-border/50 mx-1.5" />

        {/* System status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-risk-stable/5 border border-risk-stable/15">
          <div className="h-1.5 w-1.5 rounded-full bg-risk-stable animate-pulse" />
          <span className="text-[10px] text-risk-stable font-mono font-medium tracking-wide">LIVE</span>
        </div>

        {/* User avatar */}
        <button className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center ml-1 hover:border-primary/40 transition-all">
          <User className="h-3.5 w-3.5 text-primary" />
        </button>
      </div>
    </header>
  );
}

function AppShell() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-auto">
            <AppRoutes />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function RootRouter() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  if (isLanding) {
    return <LandingPage />;
  }

  return <AppShell />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RootRouter />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
