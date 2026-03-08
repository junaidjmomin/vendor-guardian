import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="h-10 flex items-center border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <SidebarTrigger className="ml-2" />
                <div className="ml-auto mr-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-risk-stable animate-pulse" />
                  <span className="text-[10px] text-muted-foreground font-mono">SYSTEM ONLINE</span>
                </div>
              </header>
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
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
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
