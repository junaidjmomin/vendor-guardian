import { Network, Lock, Shield, ArrowRight, Radio, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsortiumNetworkViz } from "@/components/ConsortiumNetworkViz";
import { PageTransition } from "@/components/motion/PageTransition";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";

const consortiumNodes = [
  { id: "n1", bank: "Bank Alpha", status: "online", lastSignal: "2 min ago", vendorsMonitored: 342 },
  { id: "n2", bank: "Bank Beta", status: "online", lastSignal: "5 min ago", vendorsMonitored: 287 },
  { id: "n3", bank: "Bank Gamma", status: "online", lastSignal: "1 min ago", vendorsMonitored: 415 },
  { id: "n4", bank: "Bank Delta", status: "syncing", lastSignal: "12 min ago", vendorsMonitored: 198 },
  { id: "n5", bank: "Bank Epsilon", status: "offline", lastSignal: "2 hrs ago", vendorsMonitored: 156 },
];

const recentSignals = [
  { id: "s1", type: "CRITICAL_BREACH", dimension: "Cybersecurity", vendorHash: "sha256:a3f9...", timestamp: "03:17 IST", certInRelevant: true },
  { id: "s2", type: "ENFORCEMENT_ACTION", dimension: "Regulatory", vendorHash: "sha256:b7c2...", timestamp: "01:30 IST", certInRelevant: true },
  { id: "s3", type: "FINANCIAL_STRESS", dimension: "Financial Health", vendorHash: "sha256:d4e1...", timestamp: "Yesterday", certInRelevant: false },
  { id: "s4", type: "CVE_CRITICAL", dimension: "Cybersecurity", vendorHash: "sha256:f8a3...", timestamp: "Yesterday", certInRelevant: false },
];

export default function ConsortiumPage() {
  return (
    <PageTransition className="space-y-6 p-5 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Network className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Consortium Intelligence</h1>
            <span className="rounded-xl bg-rbi/10 px-3 py-1.5 text-[10px] font-display font-bold text-rbi border border-rbi/20">PHASE 3</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-body">Permissioned DLT — Hyperledger Fabric • Autonomous on-chain risk agents</p>
        </div>
      </div>

      {/* Stats */}
      <StaggerContainer className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Network Nodes", value: "5", sub: "banks" },
          { label: "Shared Vendors", value: "~420", sub: "anonymized" },
          { label: "Signals Today", value: "4", sub: "broadcast" },
          { label: "Network Status", value: "LIVE", sub: "3/5 online" },
        ].map((stat) => (
          <StaggerItem key={stat.label}>
            <Card className="border-border/40 glass-card h-full rounded-2xl hover:border-primary/15 transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-lg">
              <CardContent className="p-5 text-center">
                <span className="text-[9px] font-display font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{stat.label}</span>
                <p className="mt-2.5 font-mono text-3xl font-extrabold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-body">{stat.sub}</p>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* 3D Network */}
      <StaggerItem>
        <Card className="border-border/40 glass-card overflow-hidden rounded-2xl">
          <CardHeader className="pb-3 pt-6 px-6">
            <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Network className="h-4 w-4 text-primary" />
              </div>
              3D Network Topology
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ConsortiumNetworkViz />
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Nodes + Signals */}
      <StaggerContainer className="grid gap-5 lg:grid-cols-2">
        <StaggerItem>
          <Card className="border-border/40 glass-card h-full rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Radio className="h-4 w-4 text-primary" />
                </div>
                Network Nodes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 px-6 pb-6">
              {consortiumNodes.map((node) => (
                <div key={node.id} className="flex items-center justify-between rounded-xl border border-border/30 p-4 hover:bg-secondary/15 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${node.status === "online" ? "bg-risk-stable animate-pulse" : node.status === "syncing" ? "bg-risk-watch animate-pulse" : "bg-muted-foreground/30"}`} />
                    <div>
                      <p className="text-xs font-display font-semibold text-foreground">{node.bank}</p>
                      <p className="text-[10px] text-muted-foreground font-body">{node.vendorsMonitored} vendors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-display font-bold ${node.status === "online" ? "text-risk-stable" : node.status === "syncing" ? "text-risk-watch" : "text-muted-foreground/40"}`}>
                      {node.status}
                    </span>
                    <p className="text-[10px] text-muted-foreground/60 font-body">{node.lastSignal}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border/40 glass-card h-full rounded-2xl">
            <CardHeader className="pb-3 pt-6 px-6">
              <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                Anonymized Signals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 px-6 pb-6">
              {recentSignals.map((signal) => (
                <div key={signal.id} className="rounded-xl border border-border/30 p-4 hover:bg-secondary/15 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-risk-high">{signal.type}</span>
                    <span className="text-[10px] text-muted-foreground/60 font-body">{signal.timestamp}</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2 text-[10px] flex-wrap">
                    <span className="rounded-lg bg-secondary/40 px-2.5 py-1 text-secondary-foreground font-display">{signal.dimension}</span>
                    <span className="font-mono text-muted-foreground/50">{signal.vendorHash}</span>
                    {signal.certInRelevant && (
                      <span className="rounded-lg bg-certin/10 px-2.5 py-1 text-certin font-display font-bold border border-certin/20">CERT-In</span>
                    )}
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-muted-foreground/40 font-body">
                    <Lock className="h-2.5 w-2.5" /> Source bank: REDACTED
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* DLT Info */}
      <StaggerItem>
        <Card className="border-dashed border-border/30 bg-card/20 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-foreground">Why Permissioned DLT?</h3>
                <div className="mt-3.5 grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground font-body">
                  {[
                    "Identity-permissioned nodes — verified banks only",
                    "Private data channels — granular access control",
                    "No cryptocurrency — pure enterprise DLT",
                    "RBI observer node compatible",
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <ArrowRight className="h-3 w-3 text-primary flex-shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>
    </PageTransition>
  );
}
