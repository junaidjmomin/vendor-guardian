import { useState } from "react";
import { Bell, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { alerts, type RiskBand } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
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

  return (
    <div className="space-y-4 p-4 lg:p-6 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <h1 className="font-mono text-lg font-bold tracking-wider text-primary">ALERT FEED</h1>
        <span className="ml-2 rounded bg-risk-high/10 px-2 py-0.5 font-mono text-xs text-risk-high">
          {alerts.filter((a) => a.status === "new").length} new
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "critical", "high", "watch", "stable"] as const).map((s) => (
          <button key={s} onClick={() => setFilterSeverity(s)} className={`rounded px-2.5 py-1 text-[11px] font-medium ${filterSeverity === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
            {s === "all" ? "All Severity" : s}
          </button>
        ))}
        <span className="mx-1 border-l border-border" />
        {["all", "new", "acknowledged", "assigned", "resolved"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`rounded px-2.5 py-1 text-[11px] font-medium ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
            {s === "all" ? "All Status" : s}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((alert) => (
          <Card key={alert.id} className="border-border bg-card hover:border-primary/20 transition-colors cursor-pointer" onClick={() => navigate(`/vendors/${alert.vendorId}`)}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="mt-0.5">
                <RiskBadge band={alert.severity} size="md" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{alert.title}</h3>
                    <p className="mt-0.5 text-xs text-primary">{alert.vendorName}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(alert.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{alert.description}</p>
                <div className="mt-2 flex items-center gap-3 text-[10px]">
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-secondary-foreground">{alert.dimension}</span>
                  <span className={`rounded px-1.5 py-0.5 font-medium ${alert.status === "new" ? "bg-risk-high/10 text-risk-high" : alert.status === "acknowledged" ? "bg-risk-watch/10 text-risk-watch" : "bg-primary/10 text-primary"}`}>
                    {alert.status}
                  </span>
                  {alert.assignedTo && <span className="text-muted-foreground">→ {alert.assignedTo}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
