import { useState } from "react";
import { Search, Building2, ArrowUpDown, PieChart, ChevronRight, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { vendors, type RiskBand } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { ScoreGauge } from "@/components/ScoreGauge";
import { VendorSunburst } from "@/components/D3VendorSunburst";
import { PageTransition } from "@/components/motion/PageTransition";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";
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
    <PageTransition className="space-y-6 p-5 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Vendor Registry</h1>
            <span className="rounded-lg bg-secondary/60 px-2.5 py-1 font-mono text-xs text-muted-foreground">{vendors.length}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center glass-card rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary/40 border-border/30 rounded-xl h-10 focus:bg-secondary/60" />
        </div>
        <div className="flex gap-1.5 items-center">
          <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1" />
          {bands.map((band) => (
            <button
              key={band.value}
              onClick={() => setFilterBand(band.value)}
              className={`rounded-xl px-3.5 py-2 text-[11px] font-display font-semibold transition-all duration-200 ${
                filterBand === band.value ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-secondary/40 text-secondary-foreground hover:bg-secondary/60"
              }`}
            >
              {band.label}
            </button>
          ))}
        </div>
        <button onClick={() => setSortBy(sortBy === "score" ? "change" : sortBy === "change" ? "name" : "score")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-display ml-auto">
          <ArrowUpDown className="h-3.5 w-3.5" />
          Sort: {sortBy}
        </button>
      </div>

      {/* Sunburst */}
      <StaggerItem>
        <Card className="border-border/40 glass-card rounded-2xl">
          <CardHeader className="pb-3 pt-6 px-6">
            <CardTitle className="flex items-center gap-3 text-sm font-display font-bold tracking-tight">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <PieChart className="h-4 w-4 text-primary" />
              </div>
              Vendor Category Sunburst
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <VendorSunburst />
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Vendor Cards */}
      <StaggerContainer className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((vendor) => (
          <StaggerItem key={vendor.id}>
            <Card
              onClick={() => navigate(`/vendors/${vendor.id}`)}
              className="cursor-pointer border-border/40 glass-interactive h-full rounded-2xl group hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm font-display font-bold text-foreground group-hover:text-primary transition-colors">{vendor.name}</h3>
                      <RiskBadge band={vendor.riskBand} />
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground font-body">{vendor.category}</p>
                    <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
                      <span className="font-display">Tier: <span className="text-foreground font-semibold capitalize">{vendor.tier}</span></span>
                      <span className="font-body">Contract: {vendor.contractExpiry}</span>
                    </div>
                  </div>
                  <div className="ml-3 flex flex-col items-center">
                    <ScoreGauge score={vendor.compositeScore} previousScore={vendor.previousScore} size="sm" />
                  </div>
                </div>
                {vendor.triggers.length > 0 && (
                  <div className="mt-4 border-t border-border/30 pt-3 flex items-center justify-between">
                    <p className="text-[10px] text-risk-high truncate flex-1 mr-2 font-body">{vendor.triggers[0]}</p>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                )}
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </PageTransition>
  );
}
