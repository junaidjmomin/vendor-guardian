import { GitBranch, Clock, User, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { workflowItems } from "@/data/mockData";
import { PageTransition } from "@/components/motion/PageTransition";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";
import { useNavigate } from "react-router-dom";

const statusColumns = [
  { key: "open", label: "Open", dotColor: "bg-risk-watch", borderColor: "border-l-risk-watch" },
  { key: "in_progress", label: "In Progress", dotColor: "bg-primary", borderColor: "border-l-primary" },
  { key: "pending_review", label: "Pending Review", dotColor: "bg-rbi", borderColor: "border-l-rbi" },
  { key: "resolved", label: "Resolved", dotColor: "bg-risk-stable", borderColor: "border-l-risk-stable" },
];

const priorityColors: Record<string, string> = {
  critical: "bg-risk-critical text-risk-critical-foreground border border-risk-critical-foreground/30",
  high: "bg-risk-high/10 text-risk-high",
  medium: "bg-risk-watch/10 text-risk-watch",
  low: "bg-secondary text-secondary-foreground",
};

export default function WorkflowsPage() {
  const navigate = useNavigate();

  return (
    <PageTransition className="space-y-6 p-5 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <GitBranch className="h-4 w-4 text-primary" />
        </div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground">Workflow Engine</h1>
        <span className="rounded-lg bg-secondary px-2.5 py-1 font-mono text-xs text-muted-foreground">{workflowItems.length} tasks</span>
      </div>

      {/* Kanban Board */}
      <StaggerContainer className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statusColumns.map((col) => {
          const items = workflowItems.filter((w) => w.status === col.key);
          return (
            <StaggerItem key={col.key}>
              <div>
                <div className="mb-4 flex items-center gap-2.5">
                  <div className={`h-2 w-2 rounded-full ${col.dotColor}`} />
                  <h2 className="text-xs font-display font-semibold uppercase tracking-widest text-muted-foreground">{col.label}</h2>
                  <span className="rounded-full bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{items.length}</span>
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className={`border-l-[3px] ${col.borderColor} border-border/60 bg-card/80 backdrop-blur-sm hover:bg-secondary/20 cursor-pointer transition-all duration-200 rounded-xl group`}
                      onClick={() => navigate(`/vendors/${item.vendorId}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-display font-medium text-foreground leading-snug group-hover:text-primary transition-colors">{item.title}</p>
                          <span className={`shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase ${priorityColors[item.priority]}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] text-primary font-display">{item.vendorName}</p>
                        <div className="mt-3 space-y-1.5 text-[10px] text-muted-foreground">
                          <div className="flex items-center gap-1.5"><User className="h-2.5 w-2.5" /> {item.assignedTo}</div>
                          <div className="flex items-center gap-1.5"><Clock className="h-2.5 w-2.5" /> Due: {new Date(item.dueDate).toLocaleDateString()}</div>
                          <div className="flex items-center gap-1.5"><FileText className="h-2.5 w-2.5" /> {item.auditTrailId}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border/50 py-8 text-center">
                      <p className="text-[11px] text-muted-foreground">No items</p>
                    </div>
                  )}
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </PageTransition>
  );
}