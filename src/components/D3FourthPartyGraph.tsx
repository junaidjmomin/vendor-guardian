import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: "vendor" | "subvendor" | "infrastructure";
  risk: number;
  group: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  type: "direct" | "indirect";
  strength: number;
}

interface FourthPartyGraphProps {
  vendorName: string;
  className?: string;
}

const subVendorData: Record<string, { nodes: Omit<GraphNode, keyof d3.SimulationNodeDatum>[]; links: Omit<GraphLink, keyof d3.SimulationLinkDatum<GraphNode>>[] }> = {
  default: {
    nodes: [
      { id: "main", name: "Primary Vendor", type: "vendor", risk: 40, group: 0 },
      { id: "sv1", name: "AWS ap-south-1", type: "infrastructure", risk: 15, group: 1 },
      { id: "sv2", name: "Cloudflare CDN", type: "infrastructure", risk: 10, group: 1 },
      { id: "sv3", name: "MongoDB Atlas", type: "subvendor", risk: 25, group: 2 },
      { id: "sv4", name: "Twilio SMS", type: "subvendor", risk: 30, group: 2 },
      { id: "sv5", name: "SendGrid", type: "subvendor", risk: 20, group: 2 },
      { id: "sv6", name: "Auth0", type: "subvendor", risk: 22, group: 3 },
      { id: "sv7", name: "Stripe India", type: "subvendor", risk: 18, group: 3 },
      { id: "sv8", name: "GCP (Backup)", type: "infrastructure", risk: 12, group: 1 },
      { id: "sv9", name: "Razorpay", type: "subvendor", risk: 35, group: 3 },
      { id: "sv10", name: "DigiLocker API", type: "subvendor", risk: 28, group: 4 },
      { id: "sv11", name: "NSDL e-Sign", type: "subvendor", risk: 32, group: 4 },
    ],
    links: [
      { source: "main", target: "sv1", type: "direct", strength: 0.9 },
      { source: "main", target: "sv2", type: "direct", strength: 0.7 },
      { source: "main", target: "sv3", type: "direct", strength: 0.8 },
      { source: "main", target: "sv4", type: "direct", strength: 0.5 },
      { source: "main", target: "sv5", type: "direct", strength: 0.4 },
      { source: "main", target: "sv6", type: "direct", strength: 0.6 },
      { source: "main", target: "sv7", type: "direct", strength: 0.7 },
      { source: "sv3", target: "sv1", type: "indirect", strength: 0.6 },
      { source: "sv6", target: "sv1", type: "indirect", strength: 0.5 },
      { source: "sv7", target: "sv9", type: "indirect", strength: 0.4 },
      { source: "main", target: "sv10", type: "direct", strength: 0.5 },
      { source: "sv10", target: "sv11", type: "indirect", strength: 0.7 },
      { source: "sv1", target: "sv8", type: "indirect", strength: 0.3 },
    ],
  },
};

export function FourthPartyGraph({ vendorName, className }: FourthPartyGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const drawGraph = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 400;

    const data = subVendorData.default;
    const nodesData: GraphNode[] = data.nodes.map((n) => ({
      ...n,
      name: n.id === "main" ? vendorName : n.name,
    }));
    const linksData: GraphLink[] = data.links.map((l) => ({ ...l }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    // Defs
    const defs = svg.append("defs");
    const glowFilter = defs.append("filter").attr("id", "glow");
    glowFilter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const riskColor = (risk: number) => {
      if (risk <= 15) return "#06b6d4";
      if (risk <= 25) return "#22c55e";
      if (risk <= 35) return "#f59e0b";
      return "#ef4444";
    };

    const simulation = d3.forceSimulation(nodesData)
      .force("link", d3.forceLink<GraphNode, GraphLink>(linksData).id((d) => d.id).distance(80).strength(0.5))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Links
    const link = svg.append("g")
      .selectAll("line")
      .data(linksData)
      .join("line")
      .attr("stroke", (d) => d.type === "direct" ? "hsl(190, 90%, 50%)" : "hsl(220, 15%, 25%)")
      .attr("stroke-width", (d) => d.strength * 2)
      .attr("stroke-dasharray", (d) => d.type === "indirect" ? "4,4" : "none")
      .attr("opacity", 0.5);

    // Nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodesData)
      .join("g")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Node circles
    node.append("circle")
      .attr("r", (d) => d.type === "vendor" ? 20 : d.type === "infrastructure" ? 14 : 12)
      .attr("fill", (d) => riskColor(d.risk))
      .attr("opacity", 0.8)
      .attr("stroke", (d) => riskColor(d.risk))
      .attr("stroke-width", 2)
      .attr("filter", (d) => d.type === "vendor" ? "url(#glow)" : "none")
      .on("mouseenter", function (_, d) {
        d3.select(this).attr("opacity", 1).attr("stroke-width", 3);
        setHoveredNode(d.id);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("opacity", 0.8).attr("stroke-width", 2);
        setHoveredNode(null);
      });

    // Node labels
    node.append("text")
      .attr("dy", (d) => (d.type === "vendor" ? 32 : 24))
      .attr("text-anchor", "middle")
      .attr("fill", "hsl(215, 15%, 55%)")
      .attr("font-size", "8px")
      .attr("font-family", "JetBrains Mono, monospace")
      .text((d) => d.name.length > 14 ? d.name.slice(0, 14) + "…" : d.name);

    // Risk score inside
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", (d) => d.risk > 25 ? "hsl(220, 20%, 7%)" : "hsl(210, 20%, 90%)")
      .attr("font-size", "9px")
      .attr("font-weight", "bold")
      .attr("font-family", "JetBrains Mono, monospace")
      .text((d) => d.risk);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x || 0)
        .attr("y1", (d) => (d.source as GraphNode).y || 0)
        .attr("x2", (d) => (d.target as GraphNode).x || 0)
        .attr("y2", (d) => (d.target as GraphNode).y || 0);

      node.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => simulation.stop();
  }, [vendorName]);

  useEffect(() => {
    const cleanup = drawGraph();
    return cleanup;
  }, [drawGraph]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg ref={svgRef} />
      {hoveredNode && (
        <div className="absolute top-2 right-2 rounded border border-border bg-card px-2 py-1 text-[10px] font-mono text-muted-foreground">
          Node: {hoveredNode} • Drag to reposition
        </div>
      )}
      <div className="absolute bottom-2 left-2 flex items-center gap-3 text-[9px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "#06b6d4" }} />Low Risk</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "#22c55e" }} />Moderate</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "#f59e0b" }} />Elevated</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "#ef4444" }} />High</span>
        <span className="mx-1 border-l border-border h-3" />
        <span>— Direct</span>
        <span>- - Indirect</span>
      </div>
    </div>
  );
}
