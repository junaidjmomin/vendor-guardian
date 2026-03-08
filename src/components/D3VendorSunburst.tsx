import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { vendors, dimensionLabels } from "@/data/mockData";

interface SunburstProps {
  className?: string;
}

export function VendorSunburst({ className }: SunburstProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; lines: string[] } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const size = Math.min(container.clientWidth, 480);
    const radius = size / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", size).attr("height", size);

    const g = svg.append("g").attr("transform", `translate(${radius},${radius})`);

    // Build hierarchy: Root → Risk Band → Category → Vendor (with dimension sub-arcs)
    const bandOrder = ["critical", "high", "watch", "stable"] as const;
    const bandColors: Record<string, string> = {
      critical: "#991b1b",
      high: "#dc2626",
      watch: "#f59e0b",
      stable: "#22c55e",
    };

    const hierarchyData = {
      name: "All",
      children: bandOrder.map((band) => {
        const bandVendors = vendors.filter((v) => v.riskBand === band);
        return {
          name: band.toUpperCase(),
          band,
          children: bandVendors.map((v) => ({
            name: v.name,
            band,
            category: v.category,
            score: v.compositeScore,
            children: Object.entries(v.dimensions).slice(0, 7).map(([key, value]) => ({
              name: dimensionLabels[key] || key,
              value: Math.max(5, 100 - value), // Invert so higher risk = bigger slice
              score: value,
              band,
              dimKey: key,
            })),
          })),
        };
      }).filter((b) => b.children.length > 0),
    };

    const root = d3.hierarchy(hierarchyData)
      .sum((d: any) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const partition = d3.partition<any>().size([2 * Math.PI, radius - 10]);
    partition(root);

    const arc = d3.arc<any>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0 * 0.7)
      .outerRadius((d) => d.y1 * 0.7 - 1)
      .padAngle(0.005)
      .padRadius(radius / 2);

    const getColor = (d: any): string => {
      const band = d.data.band || (d.parent && d.parent.data.band);
      if (!band) return "hsl(220, 15%, 15%)";
      const base = d3.color(bandColors[band]);
      if (!base) return bandColors[band];
      const depth = d.depth;
      if (depth === 1) return bandColors[band];
      if (depth === 2) return (base as d3.RGBColor).brighter(0.3).formatHex();
      return (base as d3.RGBColor).brighter(0.6 + (d.data.score ? (d.data.score / 100) * 0.5 : 0)).formatHex();
    };

    // Draw arcs (skip root)
    g.selectAll("path")
      .data(root.descendants().filter((d) => d.depth > 0))
      .join("path")
      .attr("d", arc)
      .attr("fill", getColor)
      .attr("opacity", 0.85)
      .attr("stroke", "hsl(220, 20%, 7%)")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("mouseenter", function (event: any, d: any) {
        d3.select(this).attr("opacity", 1).attr("stroke", "hsl(190, 90%, 50%)").attr("stroke-width", 1.5);
        const rect = container.getBoundingClientRect();
        const lines: string[] = [];
        if (d.depth === 1) {
          lines.push(`Risk Band: ${d.data.name}`);
          lines.push(`Vendors: ${d.children?.length || 0}`);
        } else if (d.depth === 2) {
          lines.push(d.data.name);
          lines.push(`Category: ${d.data.category}`);
          lines.push(`Score: ${d.data.score}`);
        } else {
          lines.push(d.data.name);
          lines.push(`Score: ${d.data.score}`);
        }
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 60,
          lines,
        });
      })
      .on("mouseleave", function () {
        d3.select(this).attr("opacity", 0.85).attr("stroke", "hsl(220, 20%, 7%)").attr("stroke-width", 0.5);
        setTooltip(null);
      });

    // Labels for depth 1 (risk bands)
    g.selectAll("text.band-label")
      .data(root.descendants().filter((d) => d.depth === 1))
      .join("text")
      .attr("class", "band-label")
      .attr("transform", (d: any) => {
        const angle = (d.x0 + d.x1) / 2;
        const r = (d.y0 + d.y1) / 2 * 0.7;
        const x = Math.sin(angle) * r;
        const y = -Math.cos(angle) * r;
        const rotate = (angle * 180 / Math.PI) - 90 + (angle > Math.PI ? 180 : 0);
        return `translate(${x},${y}) rotate(${rotate})`;
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "hsl(210, 20%, 90%)")
      .attr("font-size", "8px")
      .attr("font-weight", "700")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("pointer-events", "none")
      .text((d: any) => {
        const arcSize = d.x1 - d.x0;
        if (arcSize < 0.3) return "";
        return d.data.name;
      });

    // Center label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "hsl(190, 90%, 50%)")
      .attr("font-size", "11px")
      .attr("font-weight", "700")
      .attr("font-family", "JetBrains Mono, monospace")
      .text(`${vendors.length}`);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 14)
      .attr("fill", "hsl(215, 15%, 55%)")
      .attr("font-size", "7px")
      .attr("font-family", "JetBrains Mono, monospace")
      .text("VENDORS");

  }, []);

  return (
    <div ref={containerRef} className={`relative flex justify-center ${className}`}>
      <svg ref={svgRef} />
      {tooltip && (
        <div
          className="absolute z-10 rounded border border-border bg-card px-2.5 py-1.5 shadow-lg pointer-events-none"
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
