import { useState } from "react";
import { Bell, Clock, History, Filter, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { alerts, type RiskBand } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { AlertTimeline } from "@/components/D3AlertTimeline";
import { PageTransition } from "@/components/motion/PageTransition";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";
import { useNavigate } from "react-router-dom";

export default function AlertsPage() {
  const navigate = useNavigate();
  const [filterSeverity, setFilterSeverity] = useState<RiskBand | "all">("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = alerts.filter((a) => {
    if (filterSeverity !== "all" && a.severity !== filterSeverity) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    return true;
  });

  const newCount = alerts.filter((a) => a.status === "new").length;

  return (
    <PageTransition className="space-y-6 p-5 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-risk-high/20 to-risk-high/5 flex items-center justify-center">
          <Bell className="h-5 w-5 text-risk-high" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Alert Feed</h1>
        </div>
        {newCount > 0 && (
          <span className="rounded-xl bg-risk-high/10 px-3 py-1.5 font-mono text-xs text-risk-high font-bold border border-risk-high/20 animate-pulse">
            {newCount} new
          </span>
        )}
      </div>

      {/* Timeline */}
      <StaggerItem>
        <Card className="border-border/40 glass-card rounded-2xl">
          <CardHeader className="pb-3 pt-6 px-6">
            <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <History className="h-4 w-4 text-primary" />
              </div>
              Alert History Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <AlertTimeline />
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center glass-card rounded-2xl p-4">
        <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1" />
        {(["all", "critical", "high", "watch", "stable"] as const).map((s) => (
          <button key={s} onClick={() => setFilterSeverity(s)} className={`rounded-xl px-3.5 py-2 text-[11px] font-display font-semibold transition-all duration-200 ${filterSeverity === s ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-secondary/40 text-secondary-foreground hover:bg-secondary/60"}`}>
            {s === "all" ? "All Severity" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <span className="mx-1.5 h-5 border-l border-border/40" />
        {["all", "new", "acknowledged", "assigned", "resolved"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`rounded-xl px-3.5 py-2 text-[11px] font-display font-semibold transition-all duration-200 ${filterStatus === s ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-secondary/40 text-secondary-foreground hover:bg-secondary/60"}`}>
            {s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <StaggerContainer className="space-y-3">
        {filtered.map((alert) => (
          <StaggerItem key={alert.id}>
            <Card className="border-border/40 glass-interactive cursor-pointer rounded-2xl group hover:-translate-y-0.5 hover:shadow-lg" onClick={() => navigate(`/vendors/${alert.vendorId}`)}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="mt-0.5">
                  <RiskBadge band={alert.severity} size="md" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-display font-bold text-foreground group-hover:text-primary transition-colors">{alert.title}</h3>
                      <p className="mt-1 text-xs text-primary font-display font-medium">{alert.vendorName}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground flex-shrink-0 font-body">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed font-body">{alert.description}</p>
                  <div className="mt-3 flex items-center gap-2.5 text-[10px] flex-wrap">
                    <span className="rounded-lg bg-secondary/50 px-2.5 py-1 text-secondary-foreground font-display">{alert.dimension}</span>
                    <span className={`rounded-lg px-2.5 py-1 font-display font-semibold ${alert.status === "new" ? "bg-risk-high/10 text-risk-high" : alert.status === "acknowledged" ? "bg-risk-watch/10 text-risk-watch" : "bg-primary/10 text-primary"}`}>
                      {alert.status}
                    </span>
                    {alert.assignedTo && <span className="text-muted-foreground font-body">→ {alert.assignedTo}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </PageTransition>
  );
}
