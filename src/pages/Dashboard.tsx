import { ArrowDown, ArrowUp, Building2, AlertTriangle, Eye, TrendingDown, Shield, Grid3X3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { vendors, alerts, riskTrendData, complianceData } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreGauge } from "@/components/ScoreGauge";
import { CertInClock } from "@/components/CertInClock";
import { RiskOrb } from "@/components/RiskOrb";
import { RiskHeatmap } from "@/components/D3RiskHeatmap";
import { ConcentrationTreemap } from "@/components/D3ConcentrationTreemap";
import { AlertTimeline } from "@/components/D3AlertTimeline";
import { PageTransition } from "@/components/motion/PageTransition";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const criticalVendors = vendors.filter((v) => v.riskBand === "critical");
  const highVendors = vendors.filter((v) => v.riskBand === "high");
  const watchVendors = vendors.filter((v) => v.riskBand === "watch");
  const stableVendors = vendors.filter((v) => v.riskBand === "stable");
  const activeClocks = vendors.filter((v) => v.certInClock?.active);
  const newAlerts = alerts.filter((a) => a.status === "new").length;

  const aggregateScore = Math.round(vendors.reduce((a, v) => a + v.compositeScore, 0) / vendors.length);
  const prevAggregateScore = Math.round(vendors.reduce((a, v) => a + v.previousScore, 0) / vendors.length);

  return (
    <PageTransition className="space-y-4 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <h1 className="font-mono text-lg font-bold tracking-wider text-primary">RISK COMMAND CENTER</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Mon, 04 Mar 2024 — 09:04 IST</p>
        </div>
        <div className="flex items-center gap-2">
          {newAlerts > 0 && (
            <button onClick={() => navigate("/alerts")} className="flex items-center gap-1.5 rounded-md border border-risk-high/30 bg-risk-high/10 px-3 py-1.5 text-xs font-medium text-risk-high hover:bg-risk-high/20 transition-colors">
              <AlertTriangle className="h-3.5 w-3.5" />
              {newAlerts} New Alert{newAlerts > 1 ? "s" : ""}
            </button>
          )}
        </div>
      </div>

      {/* CERT-In Clocks */}
      {activeClocks.length > 0 && (
        <StaggerContainer className="grid gap-3 sm:grid-cols-2">
          {activeClocks.map((v) => (
            <StaggerItem key={v.id}>
              <CertInClock vendorName={v.name} remaining={v.certInClock!.remaining} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Posture Summary */}
      <StaggerContainer className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        <StaggerItem className="col-span-2 lg:col-span-1">
          <Card className="border-border bg-card overflow-hidden h-full">
            <CardContent className="p-0">
              <RiskOrb score={aggregateScore} />
            </CardContent>
          </Card>
        </StaggerItem>
        {[
          { label: "CRITICAL", count: criticalVendors.length, color: "text-risk-critical-foreground", icon: "⚫" },
          { label: "HIGH RISK", count: highVendors.length, color: "text-risk-high", icon: "🔴" },
          { label: "WATCH", count: watchVendors.length, color: "text-risk-watch", icon: "🟡" },
          { label: "STABLE", count: stableVendors.length, color: "text-risk-stable", icon: "🟢" },
        ].map((item) => (
          <StaggerItem key={item.label}>
            <Card className="border-border bg-card h-full">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                <span className={`mt-2 font-mono text-3xl font-bold ${item.color}`}>{item.count}</span>
                <span className="text-[10px] text-muted-foreground mt-1">vendors</span>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <StaggerContainer className="grid gap-4 lg:grid-cols-3">
        {/* Critical Vendors */}
        <StaggerItem className="lg:col-span-2">
          <Card className="border-border bg-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
                <AlertTriangle className="h-4 w-4 text-risk-high" />
                CRITICAL & HIGH RISK VENDORS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {[...criticalVendors, ...highVendors].map((vendor) => (
                  <button
                    key={vendor.id}
                    onClick={() => navigate(`/vendors/${vendor.id}`)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ScoreGauge score={vendor.compositeScore} previousScore={vendor.previousScore} size="sm" showDelta={false} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{vendor.name}</p>
                        <p className="text-[10px] text-muted-foreground">{vendor.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-risk-high">
                          <ArrowDown className="h-3 w-3" />
                          <span className="font-mono text-xs font-semibold">{vendor.previousScore - vendor.compositeScore}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">{vendor.triggers[0]}</p>
                      </div>
                      <RiskBadge band={vendor.riskBand} />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Risk Trend */}
        <StaggerItem>
          <Card className="border-border bg-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
                <TrendingDown className="h-4 w-4 text-risk-watch" />
                RISK POSTURE TREND
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={riskTrendData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(190, 90%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(190, 90%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 80]} tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: "6px", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="score" stroke="hsl(190, 90%, 50%)" fill="url(#scoreGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Regulatory Exposure */}
      <StaggerItem>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
              <Shield className="h-4 w-4 text-rbi" />
              REGULATORY EXPOSURE METER
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {complianceData.slice(0, 4).map((item) => (
                <div key={item.regulation} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate mr-2">{item.regulation.split(" ").slice(0, 3).join(" ")}</span>
                    <span className="font-mono text-sm font-bold text-foreground">{item.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${item.score}%`,
                        backgroundColor: item.score >= 70 ? "hsl(var(--risk-stable))" : item.score >= 50 ? "hsl(var(--risk-watch))" : "hsl(var(--risk-high))",
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{item.gaps[0]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* D3 Risk Heatmap */}
      <StaggerItem>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
              <Grid3X3 className="h-4 w-4 text-primary" />
              VENDOR × DIMENSION RISK HEATMAP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RiskHeatmap />
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Vendor Distribution */}
      <StaggerItem>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
              <Building2 className="h-4 w-4 text-primary" />
              VENDOR DISTRIBUTION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={riskTrendData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: "6px", fontSize: "11px" }} />
                <Bar dataKey="critical" stackId="a" fill="hsl(0, 72%, 51%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" stackId="a" fill="hsl(0, 72%, 51%)" fillOpacity={0.5} />
                <Bar dataKey="watch" stackId="a" fill="hsl(38, 92%, 50%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* D3 Concentration Treemap */}
      <StaggerItem>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
              <Building2 className="h-4 w-4 text-risk-watch" />
              CONCENTRATION RISK TREEMAP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConcentrationTreemap />
          </CardContent>
        </Card>
      </StaggerItem>

      {/* D3 Alert Timeline */}
      <StaggerItem>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
              <AlertTriangle className="h-4 w-4 text-risk-high" />
              ALERT HISTORY TIMELINE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertTimeline />
          </CardContent>
        </Card>
      </StaggerItem>
    </PageTransition>
  );
}
