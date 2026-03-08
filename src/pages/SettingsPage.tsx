import { Settings, Users, Shield, Bell, Database, Key, Monitor, Server, Globe, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTransition } from "@/components/motion/PageTransition";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";

const roles = [
  { role: "CTO / CRO", users: 2, permissions: "Full dashboard, Board reports, trend analysis" },
  { role: "CISO", users: 3, permissions: "Cyber dimension, CERT-In clock, dark web alerts, threat intel" },
  { role: "Compliance Officer", users: 4, permissions: "RBI/DPDP exposure, rule engine, regulatory exports" },
  { role: "Internal Audit", users: 2, permissions: "Historical timeline, evidence packages, immutable audit trail" },
  { role: "Vendor Risk / Procurement", users: 6, permissions: "Vendor scorecards, onboarding, contract tracker" },
  { role: "Business Unit Head", users: 8, permissions: "Assigned vendors only, SLA performance, operational risk" },
];

const integrations = [
  { name: "ServiceNow", status: "connected", icon: Monitor },
  { name: "RSA Archer", status: "connected", icon: Shield },
  { name: "MetricStream", status: "pending", icon: Shield },
  { name: "Microsoft Teams", status: "connected", icon: Bell },
  { name: "BitSight", status: "connected", icon: Globe },
  { name: "SecurityScorecard", status: "pending", icon: Shield },
  { name: "Active Directory / LDAP", status: "connected", icon: Key },
  { name: "CERT-In Feeds", status: "connected", icon: Database },
];

export default function SettingsPage() {
  return (
    <PageTransition className="space-y-6 p-5 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Settings</h1>
      </div>

      <StaggerContainer className="space-y-5">
        {/* RBAC */}
        <StaggerItem>
          <Card className="border-border/40 glass-card rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                Role-Based Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="divide-y divide-border/30">
                {roles.map((r) => (
                  <div key={r.role} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group hover:bg-secondary/10 -mx-2 px-2 rounded-lg transition-colors">
                    <div>
                      <p className="text-sm font-display font-semibold text-foreground">{r.role}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-body">{r.permissions}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-extrabold text-foreground">{r.users}</span>
                      <span className="text-[10px] text-muted-foreground/50 font-display">users</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Integrations */}
        <StaggerItem>
          <Card className="border-border/40 glass-card rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Database className="h-4 w-4 text-primary" />
                </div>
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {integrations.map((int) => {
                  const Icon = int.icon;
                  return (
                    <div key={int.name} className="flex items-center gap-3 rounded-xl border border-border/30 p-4 hover:bg-secondary/15 hover:border-border/50 transition-all group hover:-translate-y-0.5">
                      <div className="h-10 w-10 rounded-xl bg-secondary/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-display font-semibold text-foreground truncate">{int.name}</p>
                        <span className={`text-[10px] font-display font-bold ${int.status === "connected" ? "text-risk-stable" : "text-risk-watch"}`}>
                          {int.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* System Info */}
        <StaggerItem>
          <Card className="border-border/40 glass-card rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Cpu className="h-4 w-4 text-primary" />
                </div>
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Deployment", value: "AWS ap-south-1 (Mumbai)", icon: Server },
                  { label: "AI Engine", value: "LLM + ML + Rule Engine", icon: Cpu },
                  { label: "Data Residency", value: "India (RBI Compliant)", icon: Globe },
                  { label: "Encryption", value: "AES-256 / TLS 1.3", icon: Shield },
                  { label: "Audit Logs", value: "Immutable, append-only", icon: Database },
                  { label: "Version", value: "v1.0.0-alpha", icon: Monitor },
                ].map((info) => {
                  const Icon = info.icon;
                  return (
                    <div key={info.label} className="rounded-xl bg-secondary/15 border border-border/20 p-4 flex items-start gap-3 hover:bg-secondary/25 transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[9px] font-display font-bold text-muted-foreground/50 uppercase tracking-[0.15em]">{info.label}</p>
                        <p className="text-xs font-display font-semibold text-foreground mt-0.5">{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
