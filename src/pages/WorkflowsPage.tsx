import { useState, useCallback } from "react";
import { GitBranch, Clock, User, FileText, GripVertical, Plus, MoreHorizontal, AlertTriangle, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { workflowItems, type WorkflowItem } from "@/data/mockData";
import { PageTransition } from "@/components/motion/PageTransition";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { StaggerItem } from "@/components/motion/StaggerItem";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

type ColumnKey = "open" | "in_progress" | "pending_review" | "resolved";

const statusColumns: Array<{ key: ColumnKey; label: string; dotColor: string; borderColor: string }> = [
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

const priorityIcons: Record<string, string> = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "🟢",
};

interface KanbanCardProps {
  item: WorkflowItem;
  colKey: ColumnKey;
  onDragStart: (e: React.DragEvent, itemId: string) => void;
  onNavigate: (vendorId: string) => void;
}

function KanbanCard({ item, colKey, onDragStart, onNavigate }: KanbanCardProps) {
  const isOverdue = new Date(item.dueDate) < new Date();
  const col = statusColumns.find(c => c.key === colKey)!;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        draggable
        onDragStart={(e) => onDragStart(e, item.id)}
        className={`border-l-[3px] ${col.borderColor} border-border/40 glass-interactive cursor-grab active:cursor-grabbing rounded-xl group hover:-translate-y-0.5 hover:shadow-lg`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <GripVertical className="h-4 w-4 text-muted-foreground/30 mt-0.5 flex-shrink-0 group-hover:text-muted-foreground transition-colors" />
              <p
                className="text-xs font-display font-semibold text-foreground leading-snug group-hover:text-primary transition-colors cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onNavigate(item.vendorId); }}
              >
                {item.title}
              </p>
            </div>
            <span className={`shrink-0 rounded-lg px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${priorityColors[item.priority]}`}>
              {priorityIcons[item.priority]} {item.priority}
            </span>
          </div>

          <p
            className="mt-2 text-[11px] text-primary font-display font-medium cursor-pointer hover:underline ml-6"
            onClick={(e) => { e.stopPropagation(); onNavigate(item.vendorId); }}
          >
            {item.vendorName}
          </p>

          <div className="mt-3 ml-6 space-y-1.5 text-[10px] text-muted-foreground font-body">
            <div className="flex items-center gap-1.5">
              <User className="h-2.5 w-2.5" />
              <span className="font-display font-medium">{item.assignedTo}</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-muted-foreground/60">{item.assignedRole}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className={`h-2.5 w-2.5 ${isOverdue && colKey !== "resolved" ? "text-risk-high" : ""}`} />
              <span className={isOverdue && colKey !== "resolved" ? "text-risk-high font-bold" : ""}>
                {isOverdue && colKey !== "resolved" ? "Overdue: " : "Due: "}
                {new Date(item.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-2.5 w-2.5" />
              <span className="font-mono">{item.auditTrailId}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function WorkflowsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<WorkflowItem[]>(() => [...workflowItems]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ColumnKey | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    setDraggedId(itemId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", itemId);
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = "0.5";
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = "1";
    setDraggedId(null);
    setDragOverCol(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, colKey: ColumnKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colKey);
  }, []);

  const handleDragLeave = useCallback(() => setDragOverCol(null), []);

  const handleDrop = useCallback((e: React.DragEvent, targetCol: ColumnKey) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    if (!itemId) return;
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, status: targetCol } : item));
    setDraggedId(null);
    setDragOverCol(null);
  }, []);

  const totalTasks = items.length;
  const criticalTasks = items.filter(i => i.priority === "critical").length;
  const overdueTasks = items.filter(i => new Date(i.dueDate) < new Date() && i.status !== "resolved").length;

  return (
    <PageTransition className="space-y-6 p-5 lg:p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <GitBranch className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Workflow Engine</h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card">
            <span className="font-mono text-xs text-foreground font-bold">{totalTasks}</span>
            <span className="text-[10px] text-muted-foreground font-display">total</span>
          </div>
          {criticalTasks > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-risk-high/5 border border-risk-high/20">
              <AlertTriangle className="h-3 w-3 text-risk-high" />
              <span className="font-mono text-xs text-risk-high font-bold">{criticalTasks}</span>
              <span className="text-[10px] text-risk-high font-display">critical</span>
            </div>
          )}
          {overdueTasks > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-risk-critical-foreground/5 border border-risk-critical-foreground/20">
              <Clock className="h-3 w-3 text-risk-critical-foreground" />
              <span className="font-mono text-xs text-risk-critical-foreground font-bold">{overdueTasks}</span>
              <span className="text-[10px] text-risk-critical-foreground font-display">overdue</span>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" onDragEnd={handleDragEnd}>
        {statusColumns.map((col) => {
          const colItems = items.filter((w) => w.status === col.key);
          const isOver = dragOverCol === col.key;

          return (
            <StaggerItem key={col.key}>
              <div
                className={`rounded-2xl border transition-all duration-200 ${
                  isOver ? "border-primary/30 bg-primary/5 shadow-lg shadow-primary/10" : "border-border/20 bg-card/10"
                } p-4 min-h-[300px]`}
                onDragOver={(e) => handleDragOver(e, col.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.key)}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                    <h2 className="text-[11px] font-display font-bold uppercase tracking-[0.15em] text-muted-foreground">{col.label}</h2>
                    <span className="rounded-full bg-secondary/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{colItems.length}</span>
                  </div>
                  <button className="h-6 w-6 rounded-lg hover:bg-secondary/40 flex items-center justify-center transition-colors">
                    <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {colItems.map((item) => (
                      <KanbanCard key={item.id} item={item} colKey={col.key} onDragStart={handleDragStart} onNavigate={(vendorId) => navigate(`/vendors/${vendorId}`)} />
                    ))}
                  </AnimatePresence>

                  {colItems.length === 0 && !isOver && (
                    <div className="rounded-xl border border-dashed border-border/30 py-10 text-center">
                      <p className="text-[11px] text-muted-foreground/60 font-display">Drop items here</p>
                    </div>
                  )}

                  {isOver && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 60 }} className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center">
                      <p className="text-[11px] text-primary font-display font-semibold">Drop here</p>
                    </motion.div>
                  )}
                </div>

                <button className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/30 py-2.5 text-[11px] text-muted-foreground font-display hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all">
                  <Plus className="h-3 w-3" /> Add task
                </button>
              </div>
            </StaggerItem>
          );
        })}
      </div>
    </PageTransition>
  );
}
