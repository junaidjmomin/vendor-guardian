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
      <div>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground">Regulatory Compliance</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 ml-[42px]">Policy-as-Code enforcement layer — RBI, CERT-In, DPDP Act, SEBI/MCA21</p>
      </div>

      {/* Summary Cards */}
      <StaggerContainer className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {complianceData.map((item) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;
          return (
            <StaggerItem key={item.regulation}>
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full rounded-2xl hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <span className="text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground">{item.category}</span>
                  <div className="mt-3 h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <span className="mt-3 font-mono text-2xl font-bold text-foreground">{item.score}%</span>
                  <span className={`mt-1.5 inline-flex rounded-md px-2 py-0.5 text-[10px] font-display font-medium ${config.bg} ${config.color}`}>{config.label}</span>
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
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm rounded-2xl">
                <CardHeader className="pb-3 pt-5 px-6">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-display font-semibold text-foreground">{item.regulation}</span>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-lg px-2.5 py-1 text-[10px] font-display font-semibold ${config.bg} ${config.color}`}>{config.label}</span>
                      <span className="font-mono text-lg font-bold text-foreground">{item.score}%</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="mb-4 h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${item.score}%`,
                        backgroundColor: item.score >= 70 ? "hsl(var(--risk-stable))" : item.score >= 50 ? "hsl(var(--risk-watch))" : "hsl(var(--risk-high))",
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground">Compliance Gaps</p>
                    {item.gaps.map((gap, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <XCircle className="mt-0.5 h-3 w-3 shrink-0 text-risk-high/70" />
                        <span>{gap}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] text-muted-foreground">Last checked: {item.lastChecked}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Export CTA */}
      <StaggerItem>
        <Card className="border-border/60 bg-card/80 backdrop-blur-sm rounded-2xl">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-sm font-display font-semibold text-foreground">RBI-Ready Export Mode</h3>
              <p className="text-xs text-muted-foreground mt-1">One-click regulatory report generation — Board papers, audit packages, incident timelines</p>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-display font-semibold text-primary-foreground hover:brightness-110 transition-all shadow-sm shadow-primary/20">
              <ExternalLink className="h-3.5 w-3.5" /> Export Report
            </button>
          </CardContent>
        </Card>
      </StaggerItem>
    </PageTransition>
  );
}