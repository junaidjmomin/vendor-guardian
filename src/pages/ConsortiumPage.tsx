import { Network, Lock, Shield, Eye, ArrowRight, Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsortiumNetworkViz } from "@/components/ConsortiumNetworkViz";

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
    <div className="space-y-4 p-4 lg:p-6 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <Network className="h-5 w-5 text-primary" />
        <h1 className="font-mono text-lg font-bold tracking-wider text-primary">CONSORTIUM INTELLIGENCE NETWORK</h1>
        <span className="rounded bg-rbi/10 px-2 py-0.5 text-[10px] font-semibold text-rbi">PHASE 3</span>
      </div>
      <p className="text-xs text-muted-foreground">Permissioned DLT — Hyperledger Fabric • Autonomous on-chain risk agents • Anonymized signal broadcast</p>

      {/* Network Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Network Nodes", value: "5", sub: "banks" },
          { label: "Shared Vendors", value: "~420", sub: "anonymized" },
          { label: "Signals Today", value: "4", sub: "broadcast" },
          { label: "Network Status", value: "LIVE", sub: "3/5 online" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="p-4 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              <p className="mt-1 font-mono text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3D Network Topology */}
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
            <Network className="h-4 w-4 text-primary" /> 3D NETWORK TOPOLOGY
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ConsortiumNetworkViz />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Nodes */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
              <Radio className="h-4 w-4 text-primary" /> NETWORK NODES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {consortiumNodes.map((node) => (
              <div key={node.id} className="flex items-center justify-between rounded border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${node.status === "online" ? "bg-risk-stable animate-pulse" : node.status === "syncing" ? "bg-risk-watch animate-pulse" : "bg-muted-foreground"}`} />
                  <div>
                    <p className="text-xs font-medium text-foreground">{node.bank}</p>
                    <p className="text-[10px] text-muted-foreground">{node.vendorsMonitored} vendors monitored</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-medium ${node.status === "online" ? "text-risk-stable" : node.status === "syncing" ? "text-risk-watch" : "text-muted-foreground"}`}>
                    {node.status}
                  </span>
                  <p className="text-[10px] text-muted-foreground">Signal: {node.lastSignal}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Signals */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
              <Lock className="h-4 w-4 text-primary" /> ANONYMIZED SIGNALS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentSignals.map((signal) => (
              <div key={signal.id} className="rounded border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold text-risk-high">{signal.type}</span>
                  <span className="text-[10px] text-muted-foreground">{signal.timestamp}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-secondary-foreground">{signal.dimension}</span>
                  <span className="font-mono text-muted-foreground">{signal.vendorHash}</span>
                  {signal.certInRelevant && (
                    <span className="rounded bg-certin/10 px-1.5 py-0.5 text-certin font-semibold">CERT-In</span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Lock className="h-2.5 w-2.5" /> Source bank: REDACTED
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Architecture Info */}
      <Card className="border-dashed border-border bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Why Permissioned DLT?</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><ArrowRight className="h-3 w-3 text-primary" /> Identity-permissioned nodes — verified banks only</div>
                <div className="flex items-center gap-1.5"><ArrowRight className="h-3 w-3 text-primary" /> Private data channels — granular access control</div>
                <div className="flex items-center gap-1.5"><ArrowRight className="h-3 w-3 text-primary" /> No cryptocurrency — pure enterprise DLT</div>
                <div className="flex items-center gap-1.5"><ArrowRight className="h-3 w-3 text-primary" /> RBI observer node compatible</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
