import { useState } from "react";
import { Bell, Clock, History, Filter } from "lucide-react";
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
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Bell className="h-4 w-4 text-primary" />
        </div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground">Alert Feed</h1>
        {newCount > 0 && (
          <span className="rounded-lg bg-risk-high/10 px-2.5 py-1 font-mono text-xs text-risk-high font-semibold">
            {newCount} new
          </span>
        )}
      </div>

      {/* Timeline */}
      <StaggerItem>
        <Card className="border-border/60 bg-card/80 backdrop-blur-sm rounded-2xl">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <History className="h-3.5 w-3.5 text-primary" />
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
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1" />
        {(["all", "critical", "high", "watch", "stable"] as const).map((s) => (
          <button key={s} onClick={() => setFilterSeverity(s)} className={`rounded-lg px-3 py-1.5 text-[11px] font-display font-medium transition-all ${filterSeverity === s ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"}`}>
            {s === "all" ? "All Severity" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <span className="mx-1 h-5 border-l border-border/50" />
        {["all", "new", "acknowledged", "assigned", "resolved"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`rounded-lg px-3 py-1.5 text-[11px] font-display font-medium transition-all ${filterStatus === s ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"}`}>
            {s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <StaggerContainer className="space-y-3">
        {filtered.map((alert) => (
          <StaggerItem key={alert.id}>
            <Card className="border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 cursor-pointer rounded-2xl group" onClick={() => navigate(`/vendors/${alert.vendorId}`)}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="mt-0.5">
                  <RiskBadge band={alert.severity} size="md" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors">{alert.title}</h3>
                      <p className="mt-0.5 text-xs text-primary font-display">{alert.vendorName}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground flex-shrink-0">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{alert.description}</p>
                  <div className="mt-3 flex items-center gap-2.5 text-[10px] flex-wrap">
                    <span className="rounded-md bg-secondary/60 px-2 py-0.5 text-secondary-foreground">{alert.dimension}</span>
                    <span className={`rounded-md px-2 py-0.5 font-medium ${alert.status === "new" ? "bg-risk-high/10 text-risk-high" : alert.status === "acknowledged" ? "bg-risk-watch/10 text-risk-watch" : "bg-primary/10 text-primary"}`}>
                      {alert.status}
                    </span>
                    {alert.assignedTo && <span className="text-muted-foreground">→ {alert.assignedTo}</span>}
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