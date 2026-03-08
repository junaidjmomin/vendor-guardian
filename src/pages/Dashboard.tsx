import { ArrowDown, ArrowUp, Building2, AlertTriangle, Eye, TrendingDown, Shield, Grid3X3, Activity, Clock, Layers } from "lucide-react";
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

  const riskCounts = [
    { label: "CRITICAL", count: criticalVendors.length, icon: "◆", colorClass: "text-risk-critical-foreground", bgClass: "bg-risk-critical-foreground/10", borderClass: "border-risk-critical-foreground/20" },
    { label: "HIGH RISK", count: highVendors.length, icon: "▲", colorClass: "text-risk-high", bgClass: "bg-risk-high/10", borderClass: "border-risk-high/20" },
    { label: "WATCH", count: watchVendors.length, icon: "●", colorClass: "text-risk-watch", bgClass: "bg-risk-watch/10", borderClass: "border-risk-watch/20" },
    { label: "STABLE", count: stableVendors.length, icon: "✦", colorClass: "text-risk-stable", bgClass: "bg-risk-stable/10", borderClass: "border-risk-stable/20" },
  ];

  return (
    <PageTransition className="space-y-6 p-5 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye className="h-4 w-4 text-primary" />
            </div>
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground">Risk Command Center</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 ml-[42px]">Mon, 04 Mar 2024 — 09:04 IST</p>
        </div>
        <div className="flex items-center gap-3">
          {newAlerts > 0 && (
            <button onClick={() => navigate("/alerts")} className="flex items-center gap-2 rounded-xl border border-risk-high/20 bg-risk-high/5 px-4 py-2 text-xs font-display font-semibold text-risk-high hover:bg-risk-high/10 transition-all">
              <AlertTriangle className="h-3.5 w-3.5" />
              {newAlerts} New Alert{newAlerts > 1 ? "s" : ""}
            </button>
          )}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-risk-stable/5 border border-risk-stable/20">
            <div className="h-1.5 w-1.5 rounded-full bg-risk-stable animate-pulse" />
            <span className="text-[11px] text-risk-stable font-mono font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* CERT-In Clocks */}
      {activeClocks.length > 0 && (
        <StaggerContainer className="grid gap-4 sm:grid-cols-2">
          {activeClocks.map((v) => (
            <StaggerItem key={v.id}>
              <CertInClock vendorName={v.name} remaining={v.certInClock!.remaining} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Posture Summary - Hero Row */}
      <StaggerContainer className="grid gap-4 grid-cols-2 lg:grid-cols-6">
        {/* Risk Orb - spans 2 cols */}
        <StaggerItem className="col-span-2">
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden h-full rounded-2xl hover:border-primary/20 transition-colors duration-300">
            <CardContent className="p-0">
              <RiskOrb score={aggregateScore} />
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Risk Count Cards */}
        {riskCounts.map((item) => (
          <StaggerItem key={item.label}>
            <Card className={`border-border/60 bg-card/80 backdrop-blur-sm h-full rounded-2xl hover:${item.borderClass} transition-all duration-300 group`}>
              <CardContent className="flex flex-col items-center justify-center p-5 h-full">
                <div className={`h-8 w-8 rounded-lg ${item.bgClass} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <span className={`text-sm ${item.colorClass}`}>{item.icon}</span>
                </div>
                <span className={`font-mono text-3xl font-bold ${item.colorClass}`}>{item.count}</span>
                <span className="text-[10px] font-display font-medium tracking-wider text-muted-foreground mt-1.5 uppercase">{item.label}</span>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Critical Vendors + Risk Trend */}
      <StaggerContainer className="grid gap-5 lg:grid-cols-3">
        <StaggerItem className="lg:col-span-2">
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
                <div className="h-7 w-7 rounded-lg bg-risk-high/10 flex items-center justify-center">
                  <AlertTriangle className="h-3.5 w-3.5 text-risk-high" />
                </div>
                Critical & High Risk Vendors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-1">
              <div className="divide-y divide-border/50">
                {[...criticalVendors, ...highVendors].map((vendor) => (
                  <button
                    key={vendor.id}
                    onClick={() => navigate(`/vendors/${vendor.id}`)}
                    className="flex w-full items-center justify-between px-6 py-3.5 text-left hover:bg-secondary/30 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <ScoreGauge score={vendor.compositeScore} previousScore={vendor.previousScore} size="sm" showDelta={false} />
                      <div>
                        <p className="text-sm font-display font-medium text-foreground group-hover:text-primary transition-colors">{vendor.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{vendor.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1 text-risk-high">
                          <ArrowDown className="h-3 w-3" />
                          <span className="font-mono text-xs font-semibold">{vendor.previousScore - vendor.compositeScore}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[200px] mt-0.5">{vendor.triggers[0]}</p>
                      </div>
                      <RiskBadge band={vendor.riskBand} />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
                <div className="h-7 w-7 rounded-lg bg-risk-watch/10 flex items-center justify-center">
                  <TrendingDown className="h-3.5 w-3.5 text-risk-watch" />
                </div>
                Risk Posture Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={riskTrendData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 80]} tick={{ fontSize: 10, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(225, 22%, 8%)", border: "1px solid hsl(225, 15%, 14%)", borderRadius: "12px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }} />
                  <Area type="monotone" dataKey="score" stroke="hsl(185, 85%, 50%)" fill="url(#scoreGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Regulatory Exposure */}
      <StaggerItem>
        <Card className="border-border/60 bg-card/80 backdrop-blur-sm rounded-2xl">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
              <div className="h-7 w-7 rounded-lg bg-rbi/10 flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-rbi" />
              </div>
              Regulatory Exposure Meter
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {complianceData.slice(0, 4).map((item) => (
                <div key={item.regulation} className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate mr-2 font-display">{item.regulation.split(" ").slice(0, 3).join(" ")}</span>
                    <span className="font-mono text-sm font-bold text-foreground">{item.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${item.score}%`,
                        backgroundColor: item.score >= 70 ? "hsl(var(--risk-stable))" : item.score >= 50 ? "hsl(var(--risk-watch))" : "hsl(var(--risk-high))",
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{item.gaps[0]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Heatmap + Distribution side by side */}
      <StaggerContainer className="grid gap-5 lg:grid-cols-2">
        <StaggerItem>
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Grid3X3 className="h-3.5 w-3.5 text-primary" />
                </div>
                Vendor × Dimension Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <RiskHeatmap />
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                </div>
                Vendor Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={riskTrendData} barCategoryGap="20%">
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(225, 22%, 8%)", border: "1px solid hsl(225, 15%, 14%)", borderRadius: "12px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }} />
                  <Bar dataKey="critical" stackId="a" fill="hsl(0, 72%, 51%)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="high" stackId="a" fill="hsl(0, 72%, 51%)" fillOpacity={0.5} />
                  <Bar dataKey="watch" stackId="a" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Treemap + Alert Timeline */}
      <StaggerContainer className="grid gap-5 lg:grid-cols-2">
        <StaggerItem>
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
                <div className="h-7 w-7 rounded-lg bg-risk-watch/10 flex items-center justify-center">
                  <Building2 className="h-3.5 w-3.5 text-risk-watch" />
                </div>
                Concentration Risk Treemap
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ConcentrationTreemap />
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
                <div className="h-7 w-7 rounded-lg bg-risk-high/10 flex items-center justify-center">
                  <Activity className="h-3.5 w-3.5 text-risk-high" />
                </div>
                Alert History Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <AlertTimeline />
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}