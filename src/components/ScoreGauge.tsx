import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  previousScore?: number;
  size?: "sm" | "md" | "lg";
  showDelta?: boolean;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score <= 24) return "text-risk-critical-foreground";
  if (score <= 49) return "text-risk-high";
  if (score <= 74) return "text-risk-watch";
  return "text-risk-stable";
}

function getStrokeColor(score: number): string {
  if (score <= 24) return "stroke-risk-critical-foreground";
  if (score <= 49) return "stroke-risk-high";
  if (score <= 74) return "stroke-risk-watch";
  return "stroke-risk-stable";
}

export function ScoreGauge({ score, previousScore, size = "md", showDelta = true, className }: ScoreGaugeProps) {
  const delta = previousScore !== undefined ? score - previousScore : 0;
  const dimensions = { sm: 48, md: 72, lg: 100 };
  const dim = dimensions[size];
  const strokeWidth = size === "sm" ? 3 : size === "md" ? 4 : 5;
  const radius = (dim - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={dim} height={dim} className="-rotate-90">
        <circle cx={dim / 2} cy={dim / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={strokeWidth} strokeOpacity={0.5} />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          className={getStrokeColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-mono font-bold", getScoreColor(score), size === "sm" ? "text-sm" : size === "md" ? "text-xl" : "text-3xl")}>
          {score}
        </span>
      </div>
      {showDelta && delta !== 0 && (
        <span className={cn("mt-1.5 font-mono text-[10px] font-semibold", delta > 0 ? "text-risk-stable" : "text-risk-high")}>
          {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}
        </span>
      )}
    </div>
  );
}