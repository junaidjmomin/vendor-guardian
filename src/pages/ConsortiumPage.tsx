import { Network, Lock, Shield, ArrowRight, Radio } from "lucide-react";
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
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Network className="h-4 w-4 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground">Consortium Intelligence</h1>
          <span className="rounded-lg bg-rbi/10 px-2.5 py-1 text-[10px] font-display font-semibold text-rbi">PHASE 3</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 ml-[42px]">Permissioned DLT — Hyperledger Fabric • Autonomous on-chain risk agents</p>
      </div>

      {/* Stats */}
      <StaggerContainer className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Network Nodes", value: "5", sub: "banks", icon: "◆" },
          { label: "Shared Vendors", value: "~420", sub: "anonymized", icon: "◉" },
          { label: "Signals Today", value: "4", sub: "broadcast", icon: "⚡" },
          { label: "Network Status", value: "LIVE", sub: "3/5 online", icon: "●" },
        ].map((stat) => (
          <StaggerItem key={stat.label}>
            <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full rounded-2xl hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-5 text-center">
                <span className="text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                <p className="mt-2 font-mono text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* 3D Network */}
      <StaggerItem>
        <Card className="border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden rounded-2xl">
          <CardHeader className="pb-3 pt-5 px-6">
            <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Network className="h-3.5 w-3.5 text-primary" />
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
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Radio className="h-3.5 w-3.5 text-primary" />
                </div>
                Network Nodes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 px-6 pb-6">
              {consortiumNodes.map((node) => (
                <div key={node.id} className="flex items-center justify-between rounded-xl border border-border/50 p-3.5 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${node.status === "online" ? "bg-risk-stable animate-pulse" : node.status === "syncing" ? "bg-risk-watch animate-pulse" : "bg-muted-foreground"}`} />
                    <div>
                      <p className="text-xs font-display font-medium text-foreground">{node.bank}</p>
                      <p className="text-[10px] text-muted-foreground">{node.vendorsMonitored} vendors monitored</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-display font-medium ${node.status === "online" ? "text-risk-stable" : node.status === "syncing" ? "text-risk-watch" : "text-muted-foreground"}`}>
                      {node.status}
                    </span>
                    <p className="text-[10px] text-muted-foreground">Signal: {node.lastSignal}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full rounded-2xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="flex items-center gap-2.5 text-sm font-display font-semibold tracking-tight">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                </div>
                Anonymized Signals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 px-6 pb-6">
              {recentSignals.map((signal) => (
                <div key={signal.id} className="rounded-xl border border-border/50 p-3.5 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold text-risk-high">{signal.type}</span>
                    <span className="text-[10px] text-muted-foreground">{signal.timestamp}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px] flex-wrap">
                    <span className="rounded-md bg-secondary/60 px-2 py-0.5 text-secondary-foreground">{signal.dimension}</span>
                    <span className="font-mono text-muted-foreground">{signal.vendorHash}</span>
                    {signal.certInRelevant && (
                      <span className="rounded-md bg-certin/10 px-2 py-0.5 text-certin font-display font-semibold">CERT-In</span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
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
        <Card className="border-dashed border-border/50 bg-card/40 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-display font-semibold text-foreground">Why Permissioned DLT?</h3>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-primary flex-shrink-0" /> Identity-permissioned nodes — verified banks only</div>
                  <div className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-primary flex-shrink-0" /> Private data channels — granular access control</div>
                  <div className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-primary flex-shrink-0" /> No cryptocurrency — pure enterprise DLT</div>
                  <div className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-primary flex-shrink-0" /> RBI observer node compatible</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>
    </PageTransition>
  );
}