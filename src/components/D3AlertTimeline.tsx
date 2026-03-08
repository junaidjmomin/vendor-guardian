import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { alerts } from "@/data/mockData";

interface TimelineProps {
  className?: string;
}

// Extend alert data with more historical events for a richer timeline
const timelineEvents = [
  ...alerts.map((a) => ({
    id: a.id,
    timestamp: new Date(a.timestamp),
    severity: a.severity,
    title: a.title,
    vendor: a.vendorName,
    dimension: a.dimension,
    status: a.status,
  })),
  // Additional historical events
  { id: "h1", timestamp: new Date("2024-02-20T08:00:00Z"), severity: "watch" as const, title: "SLA Warning — ATM Networks", vendor: "ATM Networks India", dimension: "Operational", status: "resolved" },
  { id: "h2", timestamp: new Date("2024-02-15T14:30:00Z"), severity: "high" as const, title: "Data Privacy Audit Finding", vendor: "ComplianceFirst", dimension: "Data Privacy", status: "resolved" },
  { id: "h3", timestamp: new Date("2024-02-10T09:15:00Z"), severity: "watch" as const, title: "Financial Filing Delay", vendor: "DataBridge Analytics", dimension: "Financial Health", status: "resolved" },
  { id: "h4", timestamp: new Date("2024-02-05T17:45:00Z"), severity: "stable" as const, title: "SOC 2 Renewal Confirmed", vendor: "SecureAuth India", dimension: "Regulatory", status: "resolved" },
  { id: "h5", timestamp: new Date("2024-01-28T11:00:00Z"), severity: "high" as const, title: "Vulnerability Scan Failed", vendor: "CloudSec Systems", dimension: "Cybersecurity", status: "resolved" },
  { id: "h6", timestamp: new Date("2024-01-22T06:30:00Z"), severity: "critical" as const, title: "Ransomware Indicator Detected", vendor: "TechServe Infrastructure", dimension: "Cybersecurity", status: "resolved" },
  { id: "h7", timestamp: new Date("2024-01-15T13:20:00Z"), severity: "watch" as const, title: "Contract Renewal Risk", vendor: "PaySwitch Pro", dimension: "Operational", status: "resolved" },
  { id: "h8", timestamp: new Date("2024-01-08T09:00:00Z"), severity: "stable" as const, title: "Clean Audit Report", vendor: "FinCore Banking Solutions", dimension: "Regulatory", status: "resolved" },
].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

const severityColors: Record<string, string> = {
  critical: "#991b1b",
  high: "#dc2626",
  watch: "#f59e0b",
  stable: "#22c55e",
};

const severityRadius: Record<string, number> = {
  critical: 8,
  high: 6,
  watch: 5,
  stable: 4,
};

export function AlertTimeline({ className }: TimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; lines: string[] } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 300;
    const margin = { top: 30, right: 20, bottom: 40, left: 20 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const timeExtent = d3.extent(timelineEvents, (d) => d.timestamp) as [Date, Date];

    const x = d3.scaleTime()
      .domain(timeExtent)
      .range([margin.left, width - margin.right]);

    // Severity lanes
    const lanes = ["critical", "high", "watch", "stable"];
    const y = d3.scaleBand()
      .domain(lanes)
      .range([margin.top, height - margin.bottom])
      .padding(0.3);

    // Background lanes
    svg.selectAll("rect.lane")
      .data(lanes)
      .join("rect")
      .attr("class", "lane")
      .attr("x", margin.left)
      .attr("y", (d) => y(d) || 0)
      .attr("width", width - margin.left - margin.right)
      .attr("height", y.bandwidth())
      .attr("fill", (_, i) => i % 2 === 0 ? "hsl(220, 15%, 9%)" : "hsl(220, 15%, 8%)")
      .attr("rx", 3);

    // Lane labels
    svg.selectAll("text.lane-label")
      .data(lanes)
      .join("text")
      .attr("class", "lane-label")
      .attr("x", margin.left + 4)
      .attr("y", (d) => (y(d) || 0) + 12)
      .attr("fill", (d) => severityColors[d])
      .attr("font-size", "8px")
      .attr("font-weight", "600")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("opacity", 0.6)
      .text((d) => d.toUpperCase());

    // Time axis
    const xAxis = d3.axisBottom(x)
      .ticks(6)
      .tickFormat(d3.timeFormat("%b %d") as any);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("fill", "hsl(215, 15%, 55%)")
      .attr("font-size", "9px")
      .attr("font-family", "JetBrains Mono, monospace");

    svg.selectAll(".domain, .tick line").attr("stroke", "hsl(220, 15%, 18%)");

    // Connecting line along timeline
    svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", height - margin.bottom)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "hsl(220, 15%, 18%)")
      .attr("stroke-width", 1);

    // Vertical drop lines from events to axis
    svg.selectAll("line.drop")
      .data(timelineEvents)
      .join("line")
      .attr("class", "drop")
      .attr("x1", (d) => x(d.timestamp))
      .attr("x2", (d) => x(d.timestamp))
      .attr("y1", (d) => (y(d.severity) || 0) + y.bandwidth() / 2)
      .attr("y2", height - margin.bottom)
      .attr("stroke", (d) => severityColors[d.severity])
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "2,2")
      .attr("opacity", 0.3);

    // Event dots
    svg.selectAll("circle.event")
      .data(timelineEvents)
      .join("circle")
      .attr("class", "event")
      .attr("cx", (d) => x(d.timestamp))
      .attr("cy", (d) => (y(d.severity) || 0) + y.bandwidth() / 2)
      .attr("r", (d) => severityRadius[d.severity])
      .attr("fill", (d) => severityColors[d.severity])
      .attr("opacity", (d) => d.status === "resolved" ? 0.5 : 0.9)
      .attr("stroke", (d) => d.status !== "resolved" ? "hsl(210, 20%, 90%)" : "none")
      .attr("stroke-width", (d) => d.status !== "resolved" ? 2 : 0)
      .style("cursor", "pointer")
      .on("mouseenter", function (event: any, d) {
        d3.select(this)
          .transition().duration(150)
          .attr("r", (severityRadius[d.severity] || 4) + 3)
          .attr("opacity", 1);
        const rect = container.getBoundingClientRect();
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 70,
          lines: [
            d.title,
            `Vendor: ${d.vendor}`,
            `Dimension: ${d.dimension}`,
            `Severity: ${d.severity.toUpperCase()}`,
            `Status: ${d.status}`,
            d.timestamp.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          ],
        });
      })
      .on("mouseleave", function (_, d) {
        d3.select(this)
          .transition().duration(150)
          .attr("r", severityRadius[d.severity])
          .attr("opacity", d.status === "resolved" ? 0.5 : 0.9);
        setTooltip(null);
      });

    // Pulse animation on active (non-resolved) events
    const activeEvents = timelineEvents.filter((e) => e.status !== "resolved");
    if (activeEvents.length > 0) {
      svg.selectAll("circle.pulse")
        .data(activeEvents)
        .join("circle")
        .attr("class", "pulse")
        .attr("cx", (d) => x(d.timestamp))
        .attr("cy", (d) => (y(d.severity) || 0) + y.bandwidth() / 2)
        .attr("r", (d) => severityRadius[d.severity])
        .attr("fill", "none")
        .attr("stroke", (d) => severityColors[d.severity])
        .attr("stroke-width", 1.5)
        .attr("pointer-events", "none")
        .each(function () {
          const circle = d3.select(this);
          function pulse() {
            circle
              .attr("r", 6)
              .attr("opacity", 0.8)
              .transition().duration(1500).ease(d3.easeSinOut)
              .attr("r", 20)
              .attr("opacity", 0)
              .on("end", pulse);
          }
          pulse();
        });
    }

    // "Now" indicator
    const now = new Date("2024-03-04T09:04:00Z");
    if (now >= timeExtent[0] && now <= timeExtent[1]) {
      svg.append("line")
        .attr("x1", x(now))
        .attr("x2", x(now))
        .attr("y1", margin.top - 5)
        .attr("y2", height - margin.bottom)
        .attr("stroke", "hsl(190, 90%, 50%)")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4,3");

      svg.append("text")
        .attr("x", x(now))
        .attr("y", margin.top - 8)
        .attr("text-anchor", "middle")
        .attr("fill", "hsl(190, 90%, 50%)")
        .attr("font-size", "8px")
        .attr("font-weight", "600")
        .attr("font-family", "JetBrains Mono, monospace")
        .text("NOW");
    }
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg ref={svgRef} />
      {tooltip && (
        <div
          className="absolute z-10 rounded border border-border bg-card px-2.5 py-2 shadow-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
        >
          {tooltip.lines.map((line, i) => (
            <p key={i} className={`text-[10px] font-mono ${i === 0 ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
