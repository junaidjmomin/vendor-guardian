import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { vendors, dimensionLabels } from "@/data/mockData";

interface HeatmapProps {
  className?: string;
}

export function RiskHeatmap({ className }: HeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 280;
    const marginTop = 60;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = 130;

    const dimensions = Object.keys(dimensionLabels).slice(0, 7);
    const vendorData = vendors.slice(0, 8);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const x = d3.scaleBand()
      .domain(vendorData.map((v) => v.name))
      .range([marginLeft, width - marginRight])
      .padding(0.08);

    const y = d3.scaleBand()
      .domain(dimensions)
      .range([marginTop, height - marginBottom])
      .padding(0.08);

    const colorScale = d3.scaleSequential()
      .domain([0, 100])
      .interpolator(d3.interpolateRgbBasis(["#dc2626", "#f59e0b", "#22c55e", "#06b6d4"]));

    // Column headers
    svg.selectAll(".col-label")
      .data(vendorData)
      .join("text")
      .attr("class", "col-label")
      .attr("x", (d) => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr("y", marginTop - 8)
      .attr("text-anchor", "end")
      .attr("transform", (d) => `rotate(-45, ${(x(d.name) || 0) + x.bandwidth() / 2}, ${marginTop - 8})`)
      .attr("fill", "hsl(215, 15%, 55%)")
      .attr("font-size", "9px")
      .attr("font-family", "JetBrains Mono, monospace")
      .text((d) => d.name.split(" ").slice(0, 2).join(" "));

    // Row labels
    svg.selectAll(".row-label")
      .data(dimensions)
      .join("text")
      .attr("class", "row-label")
      .attr("x", marginLeft - 6)
      .attr("y", (d) => (y(d) || 0) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "hsl(215, 15%, 55%)")
      .attr("font-size", "9px")
      .attr("font-family", "Inter, sans-serif")
      .text((d) => dimensionLabels[d]?.split(" ").slice(0, 2).join(" ") || d);

    // Cells
    const cells: Array<{ vendor: string; dimension: string; score: number; vendorName: string }> = [];
    vendorData.forEach((v) => {
      dimensions.forEach((dim) => {
        const score = v.dimensions[dim as keyof typeof v.dimensions];
        cells.push({ vendor: v.name, dimension: dim, score, vendorName: v.name });
      });
    });

    svg.selectAll(".cell")
      .data(cells)
      .join("rect")
      .attr("class", "cell")
      .attr("x", (d) => x(d.vendor) || 0)
      .attr("y", (d) => y(d.dimension) || 0)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", 3)
      .attr("fill", (d) => colorScale(d.score))
      .attr("opacity", 0.85)
      .attr("stroke", "hsl(220, 20%, 7%)")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("opacity", 1).attr("stroke", "hsl(190, 90%, 50%)").attr("stroke-width", 2);
        const rect = container.getBoundingClientRect();
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 40,
          text: `${d.vendorName} — ${dimensionLabels[d.dimension]}: ${d.score}`,
        });
      })
      .on("mouseleave", function () {
        d3.select(this).attr("opacity", 0.85).attr("stroke", "hsl(220, 20%, 7%)").attr("stroke-width", 1);
        setTooltip(null);
      });

    // Score labels inside cells
    svg.selectAll(".cell-label")
      .data(cells)
      .join("text")
      .attr("class", "cell-label")
      .attr("x", (d) => (x(d.vendor) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => (y(d.dimension) || 0) + y.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", (d) => (d.score > 60 ? "hsl(220, 20%, 7%)" : "hsl(210, 20%, 90%)"))
      .attr("font-size", "9px")
      .attr("font-weight", "600")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("pointer-events", "none")
      .text((d) => d.score);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg ref={svgRef} />
      {tooltip && (
        <div
          className="absolute z-10 rounded border border-border bg-card px-2 py-1 text-[10px] text-foreground font-mono shadow-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
