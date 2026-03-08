import { Shield, CheckCircle, AlertCircle, XCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { complianceData } from "@/data/mockData";

const statusConfig = {
  compliant: { icon: CheckCircle, color: "text-risk-stable", bg: "bg-risk-stable/10", label: "Compliant" },
  partial: { icon: AlertCircle, color: "text-risk-watch", bg: "bg-risk-watch/10", label: "Partial" },
  non_compliant: { icon: XCircle, color: "text-risk-high", bg: "bg-risk-high/10", label: "Non-Compliant" },
  not_assessed: { icon: AlertCircle, color: "text-muted-foreground", bg: "bg-secondary", label: "Not Assessed" },
};

export default function CompliancePage() {
  return (
    <div className="space-y-4 p-4 lg:p-6 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="font-mono text-lg font-bold tracking-wider text-primary">REGULATORY COMPLIANCE</h1>
      </div>

      <p className="text-xs text-muted-foreground">Policy-as-Code enforcement layer — RBI, CERT-In, DPDP Act, SEBI/MCA21</p>

      {/* Summary Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {complianceData.map((item) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;
          return (
            <Card key={item.regulation} className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{item.category}</span>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="mt-2">
                  <span className="font-mono text-2xl font-bold text-foreground">{item.score}%</span>
                </div>
                <div className="mt-1">
                  <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${config.bg} ${config.color}`}>{config.label}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Regulations */}
      <div className="space-y-3">
        {complianceData.map((item) => {
          const config = statusConfig[item.status];
          return (
            <Card key={item.regulation} className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.regulation}</span>
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.color}`}>{config.label}</span>
                    <span className="font-mono text-lg font-bold text-foreground">{item.score}%</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3 h-2 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.score >= 70 ? "hsl(var(--risk-stable))" : item.score >= 50 ? "hsl(var(--risk-watch))" : "hsl(var(--risk-high))",
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Compliance Gaps</p>
                  {item.gaps.map((gap, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <XCircle className="mt-0.5 h-3 w-3 shrink-0 text-risk-high" />
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">Last checked: {item.lastChecked}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Export */}
      <Card className="border-border bg-card">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">RBI-Ready Export Mode</h3>
            <p className="text-xs text-muted-foreground">One-click regulatory report generation — Board papers, audit packages, incident timelines</p>
          </div>
          <button className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" /> Export Report
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
