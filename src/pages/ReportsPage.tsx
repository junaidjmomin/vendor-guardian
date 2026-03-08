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
    <PageTransition className="space-y-4 p-4 lg:p-6">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h1 className="font-mono text-lg font-bold tracking-wider text-primary">REPORT CENTER</h1>
      </div>
      <p className="text-xs text-muted-foreground">Machine-generated, human-verified regulatory reports. One-click RBI-ready exports.</p>

      <StaggerContainer className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <StaggerItem key={report.id}>
              <Card className="border-border bg-card hover:border-primary/20 transition-colors h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-secondary p-2">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{report.title}</h3>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{report.type} • {report.regulation}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Calendar className="h-2.5 w-2.5" /> {report.date}
                        </div>
                        {report.status === "ready" ? (
                          <button className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors">
                            <Download className="h-3 w-3" /> Download
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-risk-watch">
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
