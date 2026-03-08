import { ArrowDown, ArrowUp, Building2, AlertTriangle, Eye, TrendingDown, Shield, Grid3X3, Activity, Clock, Layers, Sparkles } from "lucide-react";
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

function SectionHeader({ icon: Icon, title, iconBg = "bg-primary/10", iconColor = "text-primary" }: { icon: any; title: string; iconBg?: string; iconColor?: string }) {
  return (
    <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
      <div className={`h-8 w-8 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      {title}
    </CardTitle>
  );
}

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
    { label: "CRITICAL", count: criticalVendors.length, icon: "◆", colorClass: "text-risk-critical-foreground", bgClass: "bg-risk-critical-foreground/10", borderHover: "hover:border-risk-critical-foreground/25" },
    { label: "HIGH RISK", count: highVendors.length, icon: "▲", colorClass: "text-risk-high", bgClass: "bg-risk-high/10", borderHover: "hover:border-risk-high/25" },
    { label: "WATCH", count: watchVendors.length, icon: "●", colorClass: "text-risk-watch", bgClass: "bg-risk-watch/10", borderHover: "hover:border-risk-watch/25" },
    { label: "STABLE", count: stableVendors.length, icon: "✦", colorClass: "text-risk-stable", bgClass: "bg-risk-stable/10", borderHover: "hover:border-risk-stable/25" },
  ];

  return (
    <PageTransition className="space-y-6 p-5 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Risk Command Center</h1>
              <p className="text-xs text-muted-foreground mt-0.5 font-body">Mon, 04 Mar 2024 — 09:04 IST</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {newAlerts > 0 && (
            <button onClick={() => navigate("/alerts")} className="flex items-center gap-2 rounded-xl border border-risk-high/20 bg-risk-high/5 px-4 py-2.5 text-xs font-display font-bold text-risk-high hover:bg-risk-high/10 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-risk-high/10">
              <AlertTriangle className="h-3.5 w-3.5" />
              {newAlerts} New Alert{newAlerts > 1 ? "s" : ""}
            </button>
          )}
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
        {/* Risk Orb */}
        <StaggerItem className="col-span-2">
          <Card className="border-border/40 glass-card overflow-hidden h-full rounded-2xl hover:border-primary/15 transition-all duration-300 shine-sweep">
            <CardContent className="p-0">
              <RiskOrb score={aggregateScore} />
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Risk Count Cards */}
        {riskCounts.map((item) => (
          <StaggerItem key={item.label}>
            <Card className={`border-border/40 glass-card h-full rounded-2xl ${item.borderHover} transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-lg`}>
              <CardContent className="flex flex-col items-center justify-center p-5 h-full">
                <div className={`h-9 w-9 rounded-xl ${item.bgClass} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <span className={`text-sm ${item.colorClass}`}>{item.icon}</span>
                </div>
                <span className={`font-mono text-3xl font-extrabold ${item.colorClass}`}>{item.count}</span>
                <span className="text-[10px] font-display font-semibold tracking-[0.15em] text-muted-foreground mt-2 uppercase">{item.label}</span>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Critical Vendors + Risk Trend */}
      <StaggerContainer className="grid gap-5 lg:grid-cols-3">
        <StaggerItem className="lg:col-span-2">
          <Card className="border-border/40 glass-card h-full rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <SectionHeader icon={AlertTriangle} title="Critical & High Risk Vendors" iconBg="bg-risk-high/10" iconColor="text-risk-high" />
            </CardHeader>
            <CardContent className="p-0 pb-2">
              <div className="divide-y divide-border/30">
                {[...criticalVendors, ...highVendors].map((vendor) => (
                  <button
                    key={vendor.id}
                    onClick={() => navigate(`/vendors/${vendor.id}`)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-secondary/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <ScoreGauge score={vendor.compositeScore} previousScore={vendor.previousScore} size="sm" showDelta={false} />
                      <div>
                        <p className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors">{vendor.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-body">{vendor.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1 text-risk-high">
                          <ArrowDown className="h-3 w-3" />
                          <span className="font-mono text-xs font-bold">{vendor.previousScore - vendor.compositeScore}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[200px] mt-0.5 font-body">{vendor.triggers[0]}</p>
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
          <Card className="border-border/40 glass-card h-full rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <SectionHeader icon={TrendingDown} title="Risk Posture Trend" iconBg="bg-risk-watch/10" iconColor="text-risk-watch" />
            </CardHeader>
            <CardContent className="px-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={riskTrendData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(185, 85%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 15%, 48%)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 80]} tick={{ fontSize: 10, fill: "hsl(215, 15%, 48%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(228, 22%, 7%)", border: "1px solid hsl(228, 14%, 16%)", borderRadius: "12px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)" }} />
                  <Area type="monotone" dataKey="score" stroke="hsl(185, 85%, 50%)" fill="url(#scoreGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Regulatory Exposure */}
      <StaggerItem>
        <Card className="border-border/40 glass-card rounded-2xl">
          <CardHeader className="pb-3 pt-6 px-6">
            <SectionHeader icon={Shield} title="Regulatory Exposure Meter" iconBg="bg-rbi/10" iconColor="text-rbi" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {complianceData.slice(0, 4).map((item) => (
                <div key={item.regulation} className="space-y-3 p-5 rounded-2xl bg-secondary/20 border border-border/30 hover:border-border/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate mr-2 font-display font-medium">{item.regulation.split(" ").slice(0, 3).join(" ")}</span>
                    <span className="font-mono text-base font-extrabold text-foreground">{item.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${item.score}%`,
                        backgroundColor: item.score >= 70 ? "hsl(var(--risk-stable))" : item.score >= 50 ? "hsl(var(--risk-watch))" : "hsl(var(--risk-high))",
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-body">{item.gaps[0]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Heatmap + Distribution */}
      <StaggerContainer className="grid gap-5 lg:grid-cols-2">
        <StaggerItem>
          <Card className="border-border/40 glass-card rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <SectionHeader icon={Grid3X3} title="Vendor × Dimension Heatmap" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <RiskHeatmap />
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border/40 glass-card rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <SectionHeader icon={Layers} title="Vendor Distribution" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={riskTrendData} barCategoryGap="20%">
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 15%, 48%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 15%, 48%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(228, 22%, 7%)", border: "1px solid hsl(228, 14%, 16%)", borderRadius: "12px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }} />
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
          <Card className="border-border/40 glass-card rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <SectionHeader icon={Building2} title="Concentration Risk Treemap" iconBg="bg-risk-watch/10" iconColor="text-risk-watch" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ConcentrationTreemap />
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border/40 glass-card rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <SectionHeader icon={Activity} title="Alert History Timeline" iconBg="bg-risk-high/10" iconColor="text-risk-high" />
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
