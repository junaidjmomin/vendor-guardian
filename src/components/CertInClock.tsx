import { Clock, AlertTriangle } from "lucide-react";

interface CertInClockProps {
  vendorName: string;
  remaining: string;
  className?: string;
}

export function CertInClock({ vendorName, remaining, className }: CertInClockProps) {
  const parts = remaining.split(":");
  const hours = parseInt(parts[0]);
  const isUrgent = hours < 1;

  return (
    <div className={`rounded-2xl border border-risk-high/20 bg-risk-high/5 p-4 backdrop-blur-sm ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-risk-high/10 flex items-center justify-center">
          <AlertTriangle className={`h-3.5 w-3.5 text-risk-high ${isUrgent ? "risk-pulse" : ""}`} />
        </div>
        <span className="text-[10px] font-display font-semibold uppercase tracking-widest text-risk-high">
          CERT-In 6-Hour Clock Active
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-display">{vendorName}</span>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-risk-high" />
          <span className={`font-mono text-xl font-bold ${isUrgent ? "text-risk-critical-foreground risk-pulse" : "text-risk-high"}`}>
            {remaining}
          </span>
        </div>
      </div>
    </div>
  );
}