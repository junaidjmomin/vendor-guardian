import { GitBranch, Clock, User, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { workflowItems } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const statusColumns = [
  { key: "open", label: "Open", color: "border-risk-watch/30" },
  { key: "in_progress", label: "In Progress", color: "border-primary/30" },
  { key: "pending_review", label: "Pending Review", color: "border-rbi/30" },
  { key: "resolved", label: "Resolved", color: "border-risk-stable/30" },
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
    <div className="space-y-4 p-4 lg:p-6 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-primary" />
        <h1 className="font-mono text-lg font-bold tracking-wider text-primary">WORKFLOW ENGINE</h1>
        <span className="ml-2 rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">{workflowItems.length} tasks</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statusColumns.map((col) => {
          const items = workflowItems.filter((w) => w.status === col.key);
          return (
            <div key={col.key}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{col.label}</h2>
                <span className="rounded-full bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <Card key={item.id} className={`border-l-2 ${col.color} bg-card hover:bg-secondary/30 cursor-pointer transition-colors`} onClick={() => navigate(`/vendors/${item.vendorId}`)}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-foreground leading-snug">{item.title}</p>
                        <span className={`shrink-0 rounded px-1 py-0.5 font-mono text-[9px] font-semibold uppercase ${priorityColors[item.priority]}`}>
                          {item.priority}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[10px] text-primary">{item.vendorName}</p>
                      <div className="mt-2 space-y-1 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1"><User className="h-2.5 w-2.5" /> {item.assignedTo}</div>
                        <div className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> Due: {new Date(item.dueDate).toLocaleDateString()}</div>
                        <div className="flex items-center gap-1"><FileText className="h-2.5 w-2.5" /> {item.auditTrailId}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {items.length === 0 && <p className="text-[10px] text-muted-foreground py-4 text-center">No items</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
