import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Calendar, Shield, Share2, ChevronRight, ExternalLink, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { vendors as mockVendors, alerts as mockAlerts, workflowItems as mockWorkflows } from "@/data/mockData";
import { dimensionLabels } from "@/data/types";
import { useVendor } from "@/hooks/api/useVendors";
import { useAlerts } from "@/hooks/api/useAlerts";
import { useWorkflows } from "@/hooks/api/useWorkflows";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreGauge } from "@/components/ScoreGauge";
import { CertInClock } from "@/components/CertInClock";
import { FourthPartyGraph } from "@/components/D3FourthPartyGraph";
import { PageTransition } from "@/components/motion/PageTransition";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis } from "recharts";

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: apiVendor } = useVendor(id ?? "");
  const { data: apiAlerts } = useAlerts({ vendor_id: id });
  const { data: apiWorkflows } = useWorkflows();

  // Fallback to mock data if API unavailable
  const vendor = apiVendor ?? mockVendors.find((v) => v.id === id);

  if (!vendor) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <p className="font-display text-lg font-bold text-foreground">Vendor not found</p>
          <button onClick={() => navigate("/vendors")} className="mt-4 text-sm text-primary hover:underline font-display">← Back to Registry</button>
        </div>
      </div>
    );
  }

  const vendorAlerts = (apiAlerts ?? mockAlerts).filter((a) => a.vendorId === vendor.id);
  const vendorWorkflows = (apiWorkflows ?? mockWorkflows).filter((w) => w.vendorId === vendor.id);

  const radarData = Object.entries(vendor.dimensions).map(([key, value]) => ({
    dimension: dimensionLabels[key]?.split(" ").slice(0, 2).join(" ") || key,
    score: value,
    fullMark: 100,
  }));

  return (
    <PageTransition className="space-y-5 p-5 lg:p-7 max-w-[1600px] mx-auto">
      {/* Back */}
      <button onClick={() => navigate("/vendors")} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-body group">
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Registry
      </button>

      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">{vendor.name}</h1>
            <RiskBadge band={vendor.riskBand} size="md" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground font-body">{vendor.category} • <span className="capitalize font-display font-medium text-foreground/80">{vendor.tier}</span> outsourcing</p>
          <div className="mt-3 flex items-center gap-6 text-xs text-muted-foreground font-body">
            <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-primary/50" /> Contract: {vendor.contractExpiry}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-primary/50" /> Assessed: {vendor.lastAssessed}</span>
          </div>
        </div>
        <ScoreGauge score={vendor.compositeScore} previousScore={vendor.previousScore} size="lg" />
      </div>

      {/* CERT-In */}
      {vendor.certInClock?.active && (
        <StaggerItem>
          <CertInClock vendorName={vendor.name} remaining={vendor.certInClock.remaining} />
        </StaggerItem>
      )}

      {/* Radar + Dimension Scores */}
      <StaggerContainer className="grid gap-5 lg:grid-cols-2">
        <StaggerItem>
          <Card className="border-border/30 glass-card h-full rounded-3xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
                <div className="h-8 w-8 rounded-xl bg-primary/8 border border-primary/8 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                9-Dimension Risk Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(230, 12%, 14%)" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9, fill: "hsl(215, 12%, 45%)" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: "hsl(215, 12%, 45%)" }} />
                  <Radar name="Score" dataKey="score" stroke="hsl(175, 80%, 48%)" fill="hsl(175, 80%, 48%)" fillOpacity={0.12} strokeWidth={2.5} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border/30 glass-card h-full rounded-3xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <CardTitle className="text-sm font-display font-bold tracking-tight">Dimension Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 px-6 pb-6">
              {Object.entries(vendor.dimensions).map(([key, value]) => (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-body">{dimensionLabels[key]}</span>
                    <span className={`font-mono text-xs font-bold ${value <= 24 ? "text-risk-critical-foreground" : value <= 49 ? "text-risk-high" : value <= 74 ? "text-risk-watch" : "text-risk-stable"}`}>
                      {value}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary/30 overflow-hidden">
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
        </StaggerItem>
      </StaggerContainer>

      {/* Fourth-Party Graph */}
      <StaggerItem>
        <Card className="border-border/30 glass-card rounded-3xl">
          <CardHeader className="pb-3 pt-6 px-6">
            <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
              <div className="h-8 w-8 rounded-xl bg-primary/8 border border-primary/8 flex items-center justify-center">
                <Share2 className="h-4 w-4 text-primary" />
              </div>
              Fourth-Party Dependency Map
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <FourthPartyGraph vendorName={vendor.name} />
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Active Triggers */}
      {vendor.triggers.length > 0 && (
        <StaggerItem>
          <Card className="border-border/30 glass-card rounded-3xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
                <div className="h-8 w-8 rounded-xl bg-risk-high/8 border border-risk-high/8 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-risk-high" />
                </div>
                Active Triggers
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-2.5">
                {vendor.triggers.map((trigger, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-2xl border border-risk-high/10 bg-risk-high/[0.03] px-5 py-3.5 group hover:bg-risk-high/[0.06] transition-colors">
                    <span className="h-2 w-2 rounded-full bg-risk-high flex-shrink-0 animate-pulse" />
                    <span className="text-[13px] text-foreground font-body">{trigger}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      )}

      {/* Alerts + Workflows */}
      <StaggerContainer className="grid gap-5 lg:grid-cols-2">
        <StaggerItem>
          <Card className="border-border/30 glass-card h-full rounded-3xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <CardTitle className="text-sm font-display font-bold tracking-tight">
                Alerts <span className="text-muted-foreground/50 font-normal font-body">({vendorAlerts.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {vendorAlerts.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center font-body">No active alerts.</p>
              ) : (
                <div className="space-y-2.5">
                  {vendorAlerts.map((alert) => (
                    <div key={alert.id} className="rounded-2xl border border-border/20 p-4 hover:bg-secondary/10 transition-colors group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-display font-bold text-foreground group-hover:text-primary transition-colors">{alert.title}</span>
                        <RiskBadge band={alert.severity} />
                      </div>
                      <p className="mt-1.5 text-[10px] text-muted-foreground font-body">{alert.dimension} • {alert.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border/30 glass-card h-full rounded-3xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <CardTitle className="text-sm font-display font-bold tracking-tight">
                Workflows <span className="text-muted-foreground/50 font-normal font-body">({vendorWorkflows.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {vendorWorkflows.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center font-body">No active workflows.</p>
              ) : (
                <div className="space-y-2.5">
                  {vendorWorkflows.map((w) => (
                    <div key={w.id} className="rounded-2xl border border-border/20 p-4">
                      <p className="text-xs font-display font-bold text-foreground">{w.title}</p>
                      <div className="mt-2 flex items-center gap-2.5 text-[10px] text-muted-foreground flex-wrap font-body">
                        <span className={`rounded-lg px-2 py-0.5 font-display font-semibold ${w.status === "open" ? "bg-risk-watch/8 text-risk-watch" : w.status === "in_progress" ? "bg-primary/8 text-primary" : "bg-secondary text-secondary-foreground"}`}>
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
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
