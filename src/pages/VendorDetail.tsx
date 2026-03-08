import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Calendar, Shield, FileText, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { vendors, alerts, workflowItems, dimensionLabels } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreGauge } from "@/components/ScoreGauge";
import { CertInClock } from "@/components/CertInClock";
import { FourthPartyGraph } from "@/components/D3FourthPartyGraph";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis } from "recharts";

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vendor = vendors.find((v) => v.id === id);

  if (!vendor) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-muted-foreground">Vendor not found.</p>
      </div>
    );
  }

  const vendorAlerts = alerts.filter((a) => a.vendorId === vendor.id);
  const vendorWorkflows = workflowItems.filter((w) => w.vendorId === vendor.id);

  const radarData = Object.entries(vendor.dimensions).map(([key, value]) => ({
    dimension: dimensionLabels[key]?.split(" ").slice(0, 2).join(" ") || key,
    score: value,
    fullMark: 100,
  }));

  return (
    <div className="space-y-4 p-4 lg:p-6 animate-fade-in-up">
      <button onClick={() => navigate("/vendors")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Registry
      </button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">{vendor.name}</h1>
            <RiskBadge band={vendor.riskBand} size="md" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{vendor.category} • {vendor.tier} outsourcing</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Contract: {vendor.contractExpiry}</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Last assessed: {vendor.lastAssessed}</span>
          </div>
        </div>
        <ScoreGauge score={vendor.compositeScore} previousScore={vendor.previousScore} size="lg" />
      </div>

      {vendor.certInClock?.active && (
        <CertInClock vendorName={vendor.name} remaining={vendor.certInClock.remaining} />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Radar Chart */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono tracking-wider">9-DIMENSION RISK PROFILE</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220, 15%, 18%)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9, fill: "hsl(215, 15%, 55%)" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: "hsl(215, 15%, 55%)" }} />
                <Radar name="Score" dataKey="score" stroke="hsl(190, 90%, 50%)" fill="hsl(190, 90%, 50%)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dimension Scores */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono tracking-wider">CATEGORY SCORES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(vendor.dimensions).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{dimensionLabels[key]}</span>
                  <span className={`font-mono text-xs font-bold ${value <= 24 ? "text-risk-critical-foreground" : value <= 49 ? "text-risk-high" : value <= 74 ? "text-risk-watch" : "text-risk-stable"}`}>
                    {value}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${value}%`,
                      backgroundColor: value <= 24 ? "hsl(var(--risk-critical-foreground))" : value <= 49 ? "hsl(var(--risk-high))" : value <= 74 ? "hsl(var(--risk-watch))" : "hsl(var(--risk-stable))",
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Fourth-Party Dependency Graph */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
            <Share2 className="h-4 w-4 text-primary" /> FOURTH-PARTY DEPENDENCY MAP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FourthPartyGraph vendorName={vendor.name} />
        </CardContent>
      </Card>

      {/* Triggers */}
      {vendor.triggers.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
              <AlertTriangle className="h-4 w-4 text-risk-high" /> ACTIVE TRIGGERS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vendor.triggers.map((trigger, i) => (
                <div key={i} className="flex items-center gap-2 rounded border border-risk-high/20 bg-risk-high/5 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-risk-high" />
                  <span className="text-xs text-foreground">{trigger}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts & Workflows */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono tracking-wider">ALERTS ({vendorAlerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {vendorAlerts.length === 0 ? (
              <p className="text-xs text-muted-foreground">No active alerts.</p>
            ) : (
              <div className="space-y-2">
                {vendorAlerts.map((alert) => (
                  <div key={alert.id} className="rounded border border-border p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{alert.title}</span>
                      <RiskBadge band={alert.severity} />
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">{alert.dimension} • {alert.status}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono tracking-wider">WORKFLOWS ({vendorWorkflows.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {vendorWorkflows.length === 0 ? (
              <p className="text-xs text-muted-foreground">No active workflows.</p>
            ) : (
              <div className="space-y-2">
                {vendorWorkflows.map((w) => (
                  <div key={w.id} className="rounded border border-border p-2">
                    <p className="text-xs font-medium text-foreground">{w.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className={`rounded px-1 py-0.5 font-mono ${w.status === "open" ? "bg-risk-watch/10 text-risk-watch" : w.status === "in_progress" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                        {w.status.replace("_", " ")}
                      </span>
                      <span>→ {w.assignedTo}</span>
                      <span>Due: {new Date(w.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
