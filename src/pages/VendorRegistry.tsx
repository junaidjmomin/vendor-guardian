import { useState } from "react";
import { Search, Filter, Building2, ArrowUpDown, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { vendors, type RiskBand } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreGauge } from "@/components/ScoreGauge";
import { VendorSunburst } from "@/components/D3VendorSunburst";
import { useNavigate } from "react-router-dom";

export default function VendorRegistry() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterBand, setFilterBand] = useState<RiskBand | "all">("all");
  const [sortBy, setSortBy] = useState<"score" | "name" | "change">("score");

  const filtered = vendors
    .filter((v) => {
      if (filterBand !== "all" && v.riskBand !== filterBand) return false;
      if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.category.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "score") return a.compositeScore - b.compositeScore;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return (a.compositeScore - a.previousScore) - (b.compositeScore - b.previousScore);
    });

  const bands: Array<{ value: RiskBand | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "watch", label: "Watch" },
    { value: "stable", label: "Stable" },
  ];

  return (
    <div className="space-y-4 p-4 lg:p-6 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <h1 className="font-mono text-lg font-bold tracking-wider text-primary">VENDOR REGISTRY</h1>
        <span className="ml-2 rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">{vendors.length} vendors</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card border-border" />
        </div>
        <div className="flex gap-1">
          {bands.map((band) => (
            <button
              key={band.value}
              onClick={() => setFilterBand(band.value)}
              className={`rounded px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                filterBand === band.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {band.label}
            </button>
          ))}
        </div>
        <button onClick={() => setSortBy(sortBy === "score" ? "change" : sortBy === "change" ? "name" : "score")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowUpDown className="h-3.5 w-3.5" />
          Sort: {sortBy}
        </button>
      </div>
      {/* Sunburst Chart */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-mono tracking-wider">
            <PieChart className="h-4 w-4 text-primary" />
            VENDOR CATEGORY SUNBURST
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VendorSunburst />
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((vendor) => (
          <Card
            key={vendor.id}
            onClick={() => navigate(`/vendors/${vendor.id}`)}
            className="cursor-pointer border-border bg-card hover:border-primary/30 transition-all"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{vendor.name}</h3>
                    <RiskBadge band={vendor.riskBand} />
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{vendor.category}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>Tier: <span className="text-foreground font-medium">{vendor.tier}</span></span>
                    <span>Contract: {vendor.contractExpiry}</span>
                  </div>
                </div>
                <ScoreGauge score={vendor.compositeScore} previousScore={vendor.previousScore} size="sm" />
              </div>
              {vendor.triggers.length > 0 && (
                <div className="mt-3 border-t border-border pt-2">
                  <p className="text-[10px] text-risk-high truncate">{vendor.triggers[0]}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
