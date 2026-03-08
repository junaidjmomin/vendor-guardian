import { Shield, CheckCircle, AlertCircle, XCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { complianceData } from "@/data/mockData";
import { PageTransition } from "@/components/motion/PageTransition";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";

const statusConfig = {
  compliant: { icon: CheckCircle, color: "text-risk-stable", bg: "bg-risk-stable/10", label: "Compliant" },
  partial: { icon: AlertCircle, color: "text-risk-watch", bg: "bg-risk-watch/10", label: "Partial" },
  non_compliant: { icon: XCircle, color: "text-risk-high", bg: "bg-risk-high/10", label: "Non-Compliant" },
  not_assessed: { icon: AlertCircle, color: "text-muted-foreground", bg: "bg-secondary", label: "Not Assessed" },
};

export default function CompliancePage() {
  return (
    <PageTransition className="space-y-6 p-5 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-rbi/20 to-rbi/5 flex items-center justify-center">
          <Shield className="h-5 w-5 text-rbi" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Regulatory Compliance</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-body">Policy-as-Code enforcement — RBI, CERT-In, DPDP Act, SEBI/MCA21</p>
        </div>
      </div>

      {/* Summary Cards */}
      <StaggerContainer className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {complianceData.map((item) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;
          return (
            <StaggerItem key={item.regulation}>
              <Card className="border-border/40 glass-card h-full rounded-2xl hover:border-primary/15 transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-lg">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <span className="text-[9px] font-display font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{item.category}</span>
                  <div className="mt-3 h-11 w-11 rounded-2xl bg-secondary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <span className="mt-3 font-mono text-2xl font-extrabold text-foreground">{item.score}%</span>
                  <span className={`mt-2 inline-flex rounded-lg px-2.5 py-1 text-[10px] font-display font-bold ${config.bg} ${config.color}`}>{config.label}</span>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Detail Cards */}
      <StaggerContainer className="space-y-4">
        {complianceData.map((item) => {
          const config = statusConfig[item.status];
          return (
            <StaggerItem key={item.regulation + "-detail"}>
              <Card className="border-border/40 glass-card rounded-2xl">
                <CardHeader className="pb-3 pt-6 px-6">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-display font-bold text-foreground">{item.regulation}</span>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-xl px-3 py-1.5 text-[10px] font-display font-bold ${config.bg} ${config.color}`}>{config.label}</span>
                      <span className="font-mono text-lg font-extrabold text-foreground">{item.score}%</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="mb-5 h-2.5 rounded-full bg-secondary/40 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${item.score}%`,
                        backgroundColor: item.score >= 70 ? "hsl(var(--risk-stable))" : item.score >= 50 ? "hsl(var(--risk-watch))" : "hsl(var(--risk-high))",
                      }}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <p className="text-[9px] font-display font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Compliance Gaps</p>
                    {item.gaps.map((gap, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs text-muted-foreground font-body">
                        <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-risk-high/60" />
                        <span className="leading-relaxed">{gap}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[10px] text-muted-foreground/50 font-body">Last checked: {item.lastChecked}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Export CTA */}
      <StaggerItem>
        <Card className="border-border/40 glass-card rounded-2xl shine-sweep overflow-hidden">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-sm font-display font-bold text-foreground">RBI-Ready Export Mode</h3>
              <p className="text-xs text-muted-foreground mt-1 font-body">One-click regulatory report generation — Board papers, audit packages, incident timelines</p>
            </div>
            <button className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-xs font-display font-bold text-primary-foreground hover:brightness-110 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5">
              <ExternalLink className="h-3.5 w-3.5" /> Export Report
            </button>
          </CardContent>
        </Card>
      </StaggerItem>
    </PageTransition>
  );
}
