import { cn } from "@/lib/utils";
import { type RiskBand, getRiskBandColor, getRiskBandBg, getRiskBandLabel } from "@/data/mockData";

interface RiskBadgeProps {
  band: RiskBand;
  className?: string;
  size?: "sm" | "md";
}

export function RiskBadge({ band, className, size = "sm" }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded font-mono font-semibold uppercase tracking-wider",
        getRiskBandBg(band),
        getRiskBandColor(band),
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
        band === "critical" && "risk-pulse border border-risk-critical-foreground/30",
        className
      )}
    >
      {band === "critical" && <span className="h-1.5 w-1.5 rounded-full bg-risk-critical-foreground animate-pulse" />}
      {band === "high" && <span className="h-1.5 w-1.5 rounded-full bg-risk-high" />}
      {band === "watch" && <span className="h-1.5 w-1.5 rounded-full bg-risk-watch" />}
      {band === "stable" && <span className="h-1.5 w-1.5 rounded-full bg-risk-stable" />}
      {getRiskBandLabel(band)}
    </span>
  );
}
