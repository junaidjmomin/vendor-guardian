import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Calendar, Shield, Share2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { vendors, alerts, workflowItems, dimensionLabels } from "@/data/mockData";
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
  const vendor = vendors.find((v) => v.id === id);

  if (!vendor) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <p className="font-display text-lg font-semibold text-foreground">Vendor not found</p>
          <p className="text-sm text-muted-foreground mt-1">The vendor you're looking for doesn't exist.</p>
          <button onClick={() => navigate("/vendors")} className="mt-4 text-sm text-primary hover:underline font-display">← Back to Registry</button>
        </div>
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
    <PageTransition className="space-y-6 p-5 lg:p-8 max-w-[1600px] mx-auto">
      {/* Back */}
      <button onClick={() => navigate("/vendors")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-display group">
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Registry
      </button>

      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-foreground">{vendor.name}</h1>
            <RiskBadge band={vendor.riskBand} size="md" />
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground font-display">{vendor.category} • <span className="capitalize">{vendor.tier}</span> outsourcing</p>
          <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Contract: {vendor.contractExpiry}</span>
            <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> Last assessed: {vendor.lastAssessed}</span>
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
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                </div>
                9-Dimension Risk Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(225, 15%, 14%)" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9, fill: "hsl(215, 15%, 50%)" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: "hsl(215, 15%, 50%)" }} />
                  <Radar name="Score" dataKey="score" stroke="hsl(185, 85%, 50%)" fill="hsl(185, 85%, 50%)" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="text-sm font-display font-semibold tracking-tight">Category Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
              {Object.entries(vendor.dimensions).map(([key, value]) => (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-display">{dimensionLabels[key]}</span>
                    <span className={`font-mono text-xs font-bold ${value <= 24 ? "text-risk-critical-foreground" : value <= 49 ? "text-risk-high" : value <= 74 ? "text-risk-watch" : "text-risk-stable"}`}>
                      {value}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
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
        <Card className="border-border/60 bg-card/80 backdrop-blur-sm rounded-2xl">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Share2 className="h-3.5 w-3.5 text-primary" />
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
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
                <div className="h-7 w-7 rounded-lg bg-risk-high/10 flex items-center justify-center">
                  <AlertTriangle className="h-3.5 w-3.5 text-risk-high" />
                </div>
                Active Triggers
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-2">
                {vendor.triggers.map((trigger, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-risk-high/15 bg-risk-high/5 px-4 py-3">
                    <span className="h-2 w-2 rounded-full bg-risk-high flex-shrink-0" />
                    <span className="text-xs text-foreground">{trigger}</span>
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
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="text-sm font-display font-semibold tracking-tight">
                Alerts <span className="text-muted-foreground font-normal">({vendorAlerts.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {vendorAlerts.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No active alerts.</p>
              ) : (
                <div className="space-y-2.5">
                  {vendorAlerts.map((alert) => (
                    <div key={alert.id} className="rounded-xl border border-border/50 p-3.5 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-display font-medium text-foreground">{alert.title}</span>
                        <RiskBadge band={alert.severity} />
                      </div>
                      <p className="mt-1.5 text-[10px] text-muted-foreground">{alert.dimension} • {alert.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="text-sm font-display font-semibold tracking-tight">
                Workflows <span className="text-muted-foreground font-normal">({vendorWorkflows.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {vendorWorkflows.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No active workflows.</p>
              ) : (
                <div className="space-y-2.5">
                  {vendorWorkflows.map((w) => (
                    <div key={w.id} className="rounded-xl border border-border/50 p-3.5">
                      <p className="text-xs font-display font-medium text-foreground">{w.title}</p>
                      <div className="mt-2 flex items-center gap-2.5 text-[10px] text-muted-foreground flex-wrap">
                        <span className={`rounded-md px-1.5 py-0.5 font-mono font-medium ${w.status === "open" ? "bg-risk-watch/10 text-risk-watch" : w.status === "in_progress" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}>
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