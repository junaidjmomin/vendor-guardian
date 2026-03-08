import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AnimatePresence } from "framer-motion";
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

function AppShell() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-12 flex items-center border-b border-border/50 bg-card/40 backdrop-blur-md sticky top-0 z-10">
            <SidebarTrigger className="ml-3" />
            <div className="ml-auto mr-4 flex items-center gap-2.5">
              <div className="h-1.5 w-1.5 rounded-full bg-risk-stable animate-pulse" />
              <span className="text-[11px] text-muted-foreground font-mono">SYSTEM ONLINE</span>
            </div>
          </header>
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