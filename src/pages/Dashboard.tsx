import { ArrowDown, Building2, AlertTriangle, Eye, TrendingDown, Shield, Grid3X3, Activity, Layers, Sparkles, ArrowUpRight } from "lucide-react";
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

function SectionCard({ icon: Icon, title, iconBg = "bg-primary/8", iconColor = "text-primary", children, className = "" }: { icon: any; title: string; iconBg?: string; iconColor?: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={`border-border/30 glass-card rounded-3xl overflow-hidden ${className}`}>
      <CardHeader className="pb-3 pt-6 px-6">
        <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
          <div className={`h-8 w-8 rounded-xl ${iconBg} border border-primary/8 flex items-center justify-center`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">{children}</CardContent>
    </Card>
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
    { label: "Critical", count: criticalVendors.length, colorClass: "text-risk-critical-foreground", bgClass: "bg-risk-critical-foreground/8", borderClass: "border-risk-critical-foreground/10", dotClass: "bg-risk-critical-foreground" },
    { label: "High Risk", count: highVendors.length, colorClass: "text-risk-high", bgClass: "bg-risk-high/8", borderClass: "border-risk-high/10", dotClass: "bg-risk-high" },
    { label: "Watch", count: watchVendors.length, colorClass: "text-risk-watch", bgClass: "bg-risk-watch/8", borderClass: "border-risk-watch/10", dotClass: "bg-risk-watch" },
    { label: "Stable", count: stableVendors.length, colorClass: "text-risk-stable", bgClass: "bg-risk-stable/8", borderClass: "border-risk-stable/10", dotClass: "bg-risk-stable" },
  ];

  return (
    <PageTransition className="space-y-5 p-5 lg:p-7 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Command Center</h1>
            <p className="text-[12px] text-muted-foreground mt-0.5 font-body flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-risk-stable animate-pulse inline-block" />
              Live • Mon, 04 Mar 2024 — 09:04 IST
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {newAlerts > 0 && (
            <button onClick={() => navigate("/alerts")} className="flex items-center gap-2.5 rounded-2xl border border-risk-high/15 bg-risk-high/5 px-5 py-2.5 text-xs font-display font-bold text-risk-high hover:bg-risk-high/10 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-risk-high/10">
              <AlertTriangle className="h-3.5 w-3.5" />
              {newAlerts} New Alert{newAlerts > 1 ? "s" : ""}
              <ArrowUpRight className="h-3 w-3" />
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

      {/* Hero Row — Orb + Risk Counts */}
      <StaggerContainer className="grid gap-4 grid-cols-2 lg:grid-cols-6">
        <StaggerItem className="col-span-2">
          <Card className="border-border/30 glass-card overflow-hidden h-full rounded-3xl shine-sweep relative group hover:border-primary/10 transition-all duration-500">
            <CardContent className="p-0">
              <RiskOrb score={aggregateScore} />
            </CardContent>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
              <div className="glass rounded-full px-4 py-1.5 flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-body text-muted-foreground">AI Risk Assessment</span>
              </div>
            </div>
          </Card>
        </StaggerItem>

        {riskCounts.map((item) => (
          <StaggerItem key={item.label}>
            <Card className={`border-border/30 glass-card h-full rounded-3xl group hover:${item.borderClass} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default`}>
              <CardContent className="flex flex-col items-center justify-center p-5 h-full relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 ${item.bgClass} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
                <div className={`h-3 w-3 rounded-full ${item.dotClass} mb-3 group-hover:scale-125 transition-transform`} />
                <span className={`font-mono text-4xl font-black ${item.colorClass}`}>{item.count}</span>
                <span className="text-[11px] font-display font-semibold tracking-wide text-muted-foreground mt-2">{item.label}</span>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Critical Vendors + Trend */}
      <StaggerContainer className="grid gap-5 lg:grid-cols-3">
        <StaggerItem className="lg:col-span-2">
          <SectionCard icon={AlertTriangle} title="Critical & High Risk Vendors" iconBg="bg-risk-high/8" iconColor="text-risk-high">
            <div className="divide-y divide-border/20 -mx-6 px-0">
              {[...criticalVendors, ...highVendors].map((vendor) => (
                <button
                  key={vendor.id}
                  onClick={() => navigate(`/vendors/${vendor.id}`)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-secondary/15 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <ScoreGauge score={vendor.compositeScore} previousScore={vendor.previousScore} size="sm" showDelta={false} />
                    <div>
                      <p className="text-sm font-display font-bold text-foreground group-hover:text-primary transition-colors">{vendor.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-body">{vendor.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center gap-1 text-risk-high">
                        <ArrowDown className="h-3 w-3" />
                        <span className="font-mono text-xs font-bold">{vendor.previousScore - vendor.compositeScore}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[180px] mt-0.5 font-body">{vendor.triggers[0]}</p>
                    </div>
                    <RiskBadge band={vendor.riskBand} />
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>
        </StaggerItem>

        <StaggerItem>
          <SectionCard icon={TrendingDown} title="Risk Posture Trend" iconBg="bg-risk-watch/8" iconColor="text-risk-watch">
            <div className="-mx-2">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={riskTrendData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(175, 80%, 48%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(175, 80%, 48%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 12%, 45%)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 80]} tick={{ fontSize: 10, fill: "hsl(215, 12%, 45%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(230, 22%, 7%)", border: "1px solid hsl(230, 12%, 14%)", borderRadius: "16px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", boxShadow: "0 12px 40px -12px rgba(0,0,0,0.6)" }} />
                  <Area type="monotone" dataKey="score" stroke="hsl(175, 80%, 48%)" fill="url(#scoreGrad)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Regulatory Exposure */}
      <StaggerItem>
        <SectionCard icon={Shield} title="Regulatory Exposure" iconBg="bg-rbi/8" iconColor="text-rbi">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {complianceData.slice(0, 4).map((item) => (
              <div key={item.regulation} className="bento-card !p-5 !rounded-2xl group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-primary/50 font-body font-bold uppercase tracking-[0.15em]">{item.category}</span>
                  <span className="font-mono text-lg font-black text-foreground">{item.score}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary/40 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.score >= 70 ? "hsl(var(--risk-stable))" : item.score >= 50 ? "hsl(var(--risk-watch))" : "hsl(var(--risk-high))",
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-body line-clamp-2">{item.gaps[0]}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </StaggerItem>

      {/* Heatmap + Distribution */}
      <StaggerContainer className="grid gap-5 lg:grid-cols-2">
        <StaggerItem>
          <SectionCard icon={Grid3X3} title="Vendor × Dimension Heatmap">
            <div className="-mx-2">
              <RiskHeatmap />
            </div>
          </SectionCard>
        </StaggerItem>
        <StaggerItem>
          <SectionCard icon={Layers} title="Vendor Distribution">
            <div className="-mx-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={riskTrendData} barCategoryGap="20%">
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 12%, 45%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 12%, 45%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(230, 22%, 7%)", border: "1px solid hsl(230, 12%, 14%)", borderRadius: "16px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }} />
                  <Bar dataKey="critical" stackId="a" fill="hsl(0, 72%, 51%)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="high" stackId="a" fill="hsl(0, 72%, 51%)" fillOpacity={0.5} />
                  <Bar dataKey="watch" stackId="a" fill="hsl(42, 95%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Treemap + Alert Timeline */}
      <StaggerContainer className="grid gap-5 lg:grid-cols-2">
        <StaggerItem>
          <SectionCard icon={Building2} title="Concentration Risk Treemap" iconBg="bg-risk-watch/8" iconColor="text-risk-watch">
            <div className="-mx-2">
              <ConcentrationTreemap />
            </div>
          </SectionCard>
        </StaggerItem>
        <StaggerItem>
          <SectionCard icon={Activity} title="Alert History Timeline" iconBg="bg-risk-high/8" iconColor="text-risk-high">
            <div className="-mx-2">
              <AlertTimeline />
            </div>
          </SectionCard>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
