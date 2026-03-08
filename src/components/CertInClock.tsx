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
    <div className={`rounded-lg border border-risk-high/30 bg-risk-high/5 p-3 ${className}`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className={`h-4 w-4 text-risk-high ${isUrgent ? "risk-pulse" : ""}`} />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-risk-high">
          CERT-In 6-Hour Clock Active
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{vendorName}</span>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-risk-high" />
          <span className={`font-mono text-lg font-bold ${isUrgent ? "text-risk-critical-foreground risk-pulse" : "text-risk-high"}`}>
            {remaining}
          </span>
        </div>
      </div>
    </div>
  );
}
