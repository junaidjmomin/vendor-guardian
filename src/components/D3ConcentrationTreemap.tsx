import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { vendors } from "@/data/mockData";

interface TreemapProps {
  className?: string;
}

export function ConcentrationTreemap({ className }: TreemapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 360;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    // Group vendors by category
    const categoryMap = new Map<string, { vendors: typeof vendors; totalRisk: number }>();
    vendors.forEach((v) => {
      const existing = categoryMap.get(v.category);
      if (existing) {
        existing.vendors.push(v);
        existing.totalRisk += (100 - v.compositeScore);
      } else {
        categoryMap.set(v.category, { vendors: [v], totalRisk: 100 - v.compositeScore });
      }
    });

    // Build hierarchy
    const hierarchyData = {
      name: "All Vendors",
      children: Array.from(categoryMap.entries()).map(([category, data]) => ({
        name: category,
        children: data.vendors.map((v) => ({
          name: v.name,
          value: 100 - v.compositeScore, // Higher value = higher risk exposure
          score: v.compositeScore,
          tier: v.tier,
          band: v.riskBand,
        })),
      })),
    };

    const root = d3.hierarchy(hierarchyData)
      .sum((d: any) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    d3.treemap<any>()
      .size([width, height])
      .paddingOuter(3)
      .paddingInner(2)
      .paddingTop(20)
      .round(true)(root);

    const riskColor = (score: number) => {
      if (score <= 24) return "#991b1b";
      if (score <= 49) return "#dc2626";
      if (score <= 74) return "#f59e0b";
      return "#22c55e";
    };

    // Category groups
    const groups = svg.selectAll("g.category")
      .data(root.children || [])
      .join("g")
      .attr("class", "category");

    // Category background
    groups.append("rect")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("fill", "hsl(220, 15%, 12%)")
      .attr("stroke", "hsl(220, 15%, 18%)")
      .attr("stroke-width", 1)
      .attr("rx", 4);

    // Category label
    groups.append("text")
      .attr("x", (d: any) => d.x0 + 6)
      .attr("y", (d: any) => d.y0 + 14)
      .attr("fill", "hsl(215, 15%, 55%)")
      .attr("font-size", "9px")
      .attr("font-weight", "600")
      .attr("font-family", "JetBrains Mono, monospace")
      .text((d: any) => {
        const availableWidth = d.x1 - d.x0 - 12;
        const name = d.data.name;
        if (availableWidth < 50) return "";
        if (name.length * 5 > availableWidth) return name.slice(0, Math.floor(availableWidth / 5)) + "…";
        return name;
      });

    // Leaf nodes
    const leaves = svg.selectAll("rect.leaf")
      .data(root.leaves())
      .join("rect")
      .attr("class", "leaf")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("width", (d: any) => Math.max(0, d.x1 - d.x0))
      .attr("height", (d: any) => Math.max(0, d.y1 - d.y0))
      .attr("fill", (d: any) => riskColor(d.data.score))
      .attr("opacity", 0.75)
      .attr("rx", 2)
      .attr("stroke", "hsl(220, 20%, 7%)")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("mouseenter", function (event: any, d: any) {
        d3.select(this).attr("opacity", 1).attr("stroke", "hsl(190, 90%, 50%)").attr("stroke-width", 2);
        const rect = container.getBoundingClientRect();
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 50,
          text: `${d.data.name} | Score: ${d.data.score} | Tier: ${d.data.tier} | Band: ${d.data.band}`,
        });
      })
      .on("mouseleave", function () {
        d3.select(this).attr("opacity", 0.75).attr("stroke", "hsl(220, 20%, 7%)").attr("stroke-width", 0.5);
        setTooltip(null);
      });

    // Leaf labels
    svg.selectAll("text.leaf-label")
      .data(root.leaves())
      .join("text")
      .attr("class", "leaf-label")
      .attr("x", (d: any) => d.x0 + 4)
      .attr("y", (d: any) => d.y0 + 12)
      .attr("fill", (d: any) => d.data.score > 50 ? "hsl(220, 20%, 7%)" : "hsl(210, 20%, 90%)")
      .attr("font-size", "8px")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-weight", "500")
      .attr("pointer-events", "none")
      .text((d: any) => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 40 || h < 16) return "";
        const name = d.data.name.split(" ").slice(0, 2).join(" ");
        if (name.length * 5 > w - 8) return name.slice(0, Math.floor((w - 8) / 5));
        return name;
      });

    // Score inside leaf
    svg.selectAll("text.leaf-score")
      .data(root.leaves())
      .join("text")
      .attr("class", "leaf-score")
      .attr("x", (d: any) => d.x0 + 4)
      .attr("y", (d: any) => d.y0 + 23)
      .attr("fill", (d: any) => d.data.score > 50 ? "hsl(220, 20%, 15%)" : "hsl(210, 20%, 75%)")
      .attr("font-size", "9px")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-weight", "700")
      .attr("pointer-events", "none")
      .text((d: any) => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 30 || h < 28) return "";
        return d.data.score;
      });
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg ref={svgRef} />
      {tooltip && (
        <div
          className="absolute z-10 rounded border border-border bg-card px-2.5 py-1.5 text-[10px] text-foreground font-mono shadow-lg pointer-events-none max-w-[280px]"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
