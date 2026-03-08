import { FileText, Download, Calendar, Shield, Building2, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageTransition } from "@/components/motion/PageTransition";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";

const reports = [
  { id: "r1", title: "Board Risk Summary — Q1 2024", type: "Board Paper", regulation: "RBI IT Outsourcing", date: "2024-03-01", status: "ready", icon: Shield },
  { id: "r2", title: "Material Outsourcing Register", type: "Regulatory Register", regulation: "RBI Directions 2023", date: "2024-03-04", status: "ready", icon: Building2 },
  { id: "r3", title: "CERT-In Incident Timeline", type: "Incident Report", regulation: "CERT-In Directions", date: "2024-03-04", status: "generating", icon: AlertTriangle },
  { id: "r4", title: "Concentration Risk Assessment", type: "Risk Analysis", regulation: "RBI Guidelines", date: "2024-02-28", status: "ready", icon: Building2 },
  { id: "r5", title: "DPDP Vendor Exposure Report", type: "Compliance Report", regulation: "DPDP Act 2023", date: "2024-03-03", status: "ready", icon: Shield },
  { id: "r6", title: "Audit Findings Log — Feb 2024", type: "Audit Package", regulation: "Internal Audit", date: "2024-02-29", status: "ready", icon: FileText },
];

export default function ReportsPage() {
  return (
    <PageTransition className="space-y-6 p-5 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground">Report Center</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 ml-[42px]">Machine-generated, human-verified regulatory reports. One-click RBI-ready exports.</p>
      </div>

      {/* Report Cards */}
      <StaggerContainer className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <StaggerItem key={report.id}>
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 h-full rounded-2xl group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-secondary/50 p-2.5 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors">{report.title}</h3>
                      <p className="mt-1 text-[11px] text-muted-foreground">{report.type} • {report.regulation}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {report.date}
                        </div>
                        {report.status === "ready" ? (
                          <button className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-display font-medium text-primary hover:bg-primary/20 transition-colors">
                            <Download className="h-3 w-3" /> Download
                          </button>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[11px] text-risk-watch">
                            <Clock className="h-3 w-3 animate-spin" /> Generating...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </PageTransition>
  );
}