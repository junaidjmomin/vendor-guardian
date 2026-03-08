import { Settings, Users, Shield, Bell, Database, Key, Monitor } from "lucide-react";
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
  { name: "BitSight", status: "connected", icon: Shield },
  { name: "SecurityScorecard", status: "pending", icon: Shield },
  { name: "Active Directory / LDAP", status: "connected", icon: Key },
  { name: "CERT-In Feeds", status: "connected", icon: Database },
];

export default function SettingsPage() {
  return (
    <PageTransition className="space-y-4 p-4 lg:p-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h1 className="font-mono text-lg font-bold tracking-wider text-primary">SETTINGS</h1>
      </div>

      <StaggerContainer className="space-y-4">
        <StaggerItem>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
                <Users className="h-4 w-4 text-primary" /> ROLE-BASED ACCESS CONTROL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {roles.map((r) => (
                  <div key={r.role} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.role}</p>
                      <p className="text-[10px] text-muted-foreground">{r.permissions}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-foreground">{r.users}</span>
                      <p className="text-[10px] text-muted-foreground">users</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
                <Database className="h-4 w-4 text-primary" /> INTEGRATIONS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {integrations.map((int) => {
                  const Icon = int.icon;
                  return (
                    <div key={int.name} className="flex items-center gap-3 rounded border border-border p-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground">{int.name}</p>
                        <span className={`text-[10px] font-medium ${int.status === "connected" ? "text-risk-stable" : "text-risk-watch"}`}>
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

        <StaggerItem>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono tracking-wider">SYSTEM INFORMATION</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                {[
                  { label: "Deployment", value: "AWS ap-south-1 (Mumbai)" },
                  { label: "AI Engine", value: "LLM + ML + Rule Engine" },
                  { label: "Data Residency", value: "India (RBI Compliant)" },
                  { label: "Encryption", value: "AES-256 / TLS 1.3" },
                  { label: "Audit Logs", value: "Immutable, append-only" },
                  { label: "Version", value: "v1.0.0-alpha" },
                ].map((info) => (
                  <div key={info.label} className="rounded bg-secondary/50 p-2">
                    <p className="text-[10px] text-muted-foreground">{info.label}</p>
                    <p className="font-medium text-foreground">{info.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
