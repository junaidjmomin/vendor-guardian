import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AnimatePresence } from "framer-motion";
import { Search, Bell, User, Command } from "lucide-react";
import { useRealtimeUpdates } from "./hooks/useRealtimeUpdates";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
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
    <header className="h-14 flex items-center border-b border-border/20 bg-background/70 backdrop-blur-2xl sticky top-0 z-10">
      <SidebarTrigger className="ml-3" />
      
      {title && (
        <div className="ml-4 hidden sm:flex items-center gap-2">
          <span className="text-muted-foreground/30 font-body text-xs">/</span>
          <span className="text-[13px] font-display font-semibold text-foreground">{title}</span>
        </div>
      )}

      <div className="ml-auto mr-4 flex items-center gap-1">
        {/* Search */}
        <button className="h-8 px-3 rounded-xl flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all text-xs font-body">
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded-md bg-secondary/50 px-1.5 font-mono text-[9px] text-muted-foreground/50">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="relative h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all">
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-risk-high ring-2 ring-background" />
        </button>

        <div className="h-5 w-px bg-border/20 mx-1" />

        {/* User */}
        <button className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center hover:border-primary/20 transition-all">
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

function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useRealtimeUpdates();
  return <>{children}</>;
}

function RootRouter() {
  const location = useLocation();

  if (location.pathname === "/") {
    return <LandingPage />;
  }

  if (location.pathname === "/login") {
    return <LoginPage />;
  }

  return (
    <RealtimeProvider>
      <AppShell />
    </RealtimeProvider>
  );
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
