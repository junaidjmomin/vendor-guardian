export type RiskBand = "critical" | "high" | "watch" | "stable";

export interface Vendor {
  id: string;
  name: string;
  category: string;
  compositeScore: number;
  previousScore: number;
  riskBand: RiskBand;
  tier: "material" | "significant" | "standard";
  contractExpiry: string;
  lastAssessed: string;
  dimensions: {
    cybersecurity: number;
    regulatory: number;
    operational: number;
    newsLegal: number;
    financialHealth: number;
    dataPrivacy: number;
    concentration: number;
    esg: number;
    fourthParty: number;
  };
  triggers: string[];
  certInClock?: { active: boolean; remaining: string; startedAt: string };
}

export interface Alert {
  id: string;
  vendorId: string;
  vendorName: string;
  severity: RiskBand;
  title: string;
  description: string;
  dimension: string;
  timestamp: string;
  status: "new" | "acknowledged" | "assigned" | "resolved";
  assignedTo?: string;
}

export interface WorkflowItem {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "pending_review" | "resolved" | "closed";
  assignedTo: string;
  assignedRole: string;
  createdAt: string;
  dueDate: string;
  resolution?: string;
  auditTrailId: string;
}

export interface ComplianceStatus {
  regulation: string;
  category: string;
  score: number;
  status: "compliant" | "partial" | "non_compliant" | "not_assessed";
  lastChecked: string;
  gaps: string[];
}

export const vendors: Vendor[] = [
  {
    id: "v001",
    name: "Acme Payments Ltd.",
    category: "Payment Switch Operator",
    compositeScore: 34,
    previousScore: 61,
    riskBand: "high",
    tier: "material",
    contractExpiry: "2025-06-30",
    lastAssessed: "2024-03-04",
    dimensions: { cybersecurity: 28, regulatory: 61, operational: 70, newsLegal: 55, financialHealth: 80, dataPrivacy: 72, concentration: 65, esg: 58, fourthParty: 45 },
    triggers: ["Dark web credential dump detected (12,400 records)", "CVE-2024-1187 unpatched for 14 days"],
    certInClock: { active: true, remaining: "02:14:33", startedAt: "2024-03-04T03:17:00Z" },
  },
  {
    id: "v002",
    name: "TechServe Infrastructure",
    category: "Cloud Infrastructure Provider",
    compositeScore: 21,
    previousScore: 62,
    riskBand: "critical",
    tier: "material",
    contractExpiry: "2024-12-31",
    lastAssessed: "2024-03-03",
    dimensions: { cybersecurity: 15, regulatory: 18, operational: 32, newsLegal: 12, financialHealth: 41, dataPrivacy: 28, concentration: 35, esg: 42, fourthParty: 20 },
    triggers: ["RBI enforcement action filed", "CEO under investigation", "3 critical CVEs unpatched"],
    certInClock: { active: true, remaining: "00:42:11", startedAt: "2024-03-04T01:30:00Z" },
  },
  {
    id: "v003",
    name: "DataBridge Analytics",
    category: "KYC/AML Bureau",
    compositeScore: 43,
    previousScore: 61,
    riskBand: "high",
    tier: "material",
    contractExpiry: "2025-03-31",
    lastAssessed: "2024-03-02",
    dimensions: { cybersecurity: 52, regulatory: 38, operational: 55, newsLegal: 41, financialHealth: 32, dataPrivacy: 45, concentration: 48, esg: 55, fourthParty: 38 },
    triggers: ["MCA filing anomaly detected", "Liquidity stress indicators elevated"],
  },
  {
    id: "v004",
    name: "CloudSec Systems",
    category: "SOC Outsourcer",
    compositeScore: 47,
    previousScore: 61,
    riskBand: "high",
    tier: "significant",
    contractExpiry: "2025-09-30",
    lastAssessed: "2024-03-01",
    dimensions: { cybersecurity: 38, regulatory: 55, operational: 48, newsLegal: 62, financialHealth: 72, dataPrivacy: 42, concentration: 55, esg: 48, fourthParty: 35 },
    triggers: ["CVE-2024-1187 unpatched", "SLA breach: response time exceeded 3x in February"],
  },
  {
    id: "v005",
    name: "FinCore Banking Solutions",
    category: "Core Banking Platform",
    compositeScore: 78,
    previousScore: 75,
    riskBand: "stable",
    tier: "material",
    contractExpiry: "2026-12-31",
    lastAssessed: "2024-02-28",
    dimensions: { cybersecurity: 82, regulatory: 88, operational: 85, newsLegal: 90, financialHealth: 78, dataPrivacy: 75, concentration: 42, esg: 72, fourthParty: 55 },
    triggers: [],
  },
  {
    id: "v006",
    name: "SecureAuth India",
    category: "Identity & Access Management",
    compositeScore: 85,
    previousScore: 82,
    riskBand: "stable",
    tier: "significant",
    contractExpiry: "2025-11-30",
    lastAssessed: "2024-02-28",
    dimensions: { cybersecurity: 90, regulatory: 85, operational: 88, newsLegal: 92, financialHealth: 82, dataPrivacy: 88, concentration: 72, esg: 78, fourthParty: 62 },
    triggers: [],
  },
  {
    id: "v007",
    name: "PaySwitch Pro",
    category: "Payment Gateway",
    compositeScore: 62,
    previousScore: 68,
    riskBand: "watch",
    tier: "material",
    contractExpiry: "2025-08-15",
    lastAssessed: "2024-03-01",
    dimensions: { cybersecurity: 65, regulatory: 58, operational: 62, newsLegal: 70, financialHealth: 55, dataPrivacy: 68, concentration: 58, esg: 52, fourthParty: 48 },
    triggers: ["Minor SLA degradation in February", "Competitor acquisition rumor"],
  },
  {
    id: "v008",
    name: "ATM Networks India",
    category: "ATM Operations",
    compositeScore: 71,
    previousScore: 73,
    riskBand: "watch",
    tier: "significant",
    contractExpiry: "2025-05-31",
    lastAssessed: "2024-02-25",
    dimensions: { cybersecurity: 72, regulatory: 75, operational: 68, newsLegal: 78, financialHealth: 70, dataPrivacy: 65, concentration: 75, esg: 62, fourthParty: 55 },
    triggers: ["Contract renewal approaching"],
  },
  {
    id: "v009",
    name: "DataVault Storage",
    category: "Data Center Provider",
    compositeScore: 88,
    previousScore: 86,
    riskBand: "stable",
    tier: "standard",
    contractExpiry: "2026-06-30",
    lastAssessed: "2024-02-20",
    dimensions: { cybersecurity: 92, regulatory: 90, operational: 88, newsLegal: 95, financialHealth: 85, dataPrivacy: 82, concentration: 80, esg: 88, fourthParty: 72 },
    triggers: [],
  },
  {
    id: "v010",
    name: "ComplianceFirst",
    category: "Regulatory Reporting",
    compositeScore: 55,
    previousScore: 60,
    riskBand: "watch",
    tier: "standard",
    contractExpiry: "2025-04-30",
    lastAssessed: "2024-02-28",
    dimensions: { cybersecurity: 58, regulatory: 52, operational: 60, newsLegal: 55, financialHealth: 62, dataPrivacy: 50, concentration: 48, esg: 45, fourthParty: 42 },
    triggers: ["Data privacy audit finding pending"],
  },
];

export const alerts: Alert[] = [
  { id: "a001", vendorId: "v002", vendorName: "TechServe Infrastructure", severity: "critical", title: "RBI Enforcement Action Filed", description: "Reserve Bank of India has filed an enforcement action against TechServe Infrastructure for non-compliance with IT outsourcing directions.", dimension: "Regulatory Compliance", timestamp: "2024-03-04T01:30:00Z", status: "new" },
  { id: "a002", vendorId: "v001", vendorName: "Acme Payments Ltd.", severity: "high", title: "Dark Web Credential Dump", description: "12,400 credential records linked to Acme Payments detected on dark web marketplace. Includes employee and potentially customer-linked data.", dimension: "Cybersecurity Posture", timestamp: "2024-03-04T03:17:00Z", status: "acknowledged" },
  { id: "a003", vendorId: "v003", vendorName: "DataBridge Analytics", severity: "high", title: "Financial Stress Indicators", description: "MCA21 filing anomaly detected. Delayed annual returns and liquidity stress indicators suggest financial health deterioration.", dimension: "Financial Health", timestamp: "2024-03-03T14:22:00Z", status: "assigned", assignedTo: "Rahul Mehta" },
  { id: "a004", vendorId: "v004", vendorName: "CloudSec Systems", severity: "high", title: "Critical CVE Unpatched", description: "CVE-2024-1187 (CVSS 9.8) remains unpatched after 14 days. Affects CloudSec's perimeter firewall appliances.", dimension: "Cybersecurity Posture", timestamp: "2024-03-02T09:45:00Z", status: "assigned", assignedTo: "Priya Sharma" },
  { id: "a005", vendorId: "v007", vendorName: "PaySwitch Pro", severity: "watch", title: "SLA Performance Degradation", description: "Transaction processing latency exceeded SLA thresholds 3 times in February. P99 latency increased 40% month-over-month.", dimension: "Operational Resilience", timestamp: "2024-03-01T11:00:00Z", status: "acknowledged" },
  { id: "a006", vendorId: "v002", vendorName: "TechServe Infrastructure", severity: "critical", title: "CEO Under Investigation", description: "TechServe CEO named in SEBI investigation for insider trading. Board instability risk elevated.", dimension: "News & Legal", timestamp: "2024-03-03T08:15:00Z", status: "new" },
  { id: "a007", vendorId: "v010", vendorName: "ComplianceFirst", severity: "watch", title: "Data Privacy Audit Finding", description: "Pending audit finding related to DPDP Act compliance. Data processing agreement requires update.", dimension: "Data Privacy", timestamp: "2024-02-28T16:30:00Z", status: "assigned", assignedTo: "Anil Kumar" },
];

export const workflowItems: WorkflowItem[] = [
  { id: "w001", vendorId: "v002", vendorName: "TechServe Infrastructure", title: "Initiate vendor review — RBI enforcement action", priority: "critical", status: "open", assignedTo: "CISO Office", assignedRole: "CISO", createdAt: "2024-03-04T01:35:00Z", dueDate: "2024-03-04T07:30:00Z", auditTrailId: "AUD-2024-7820" },
  { id: "w002", vendorId: "v001", vendorName: "Acme Payments Ltd.", title: "Assess data scope — dark web credential dump", priority: "critical", status: "in_progress", assignedTo: "Priya Sharma", assignedRole: "CISO", createdAt: "2024-03-04T03:20:00Z", dueDate: "2024-03-04T09:17:00Z", auditTrailId: "AUD-2024-7821" },
  { id: "w003", vendorId: "v003", vendorName: "DataBridge Analytics", title: "Review financial health — MCA filing anomaly", priority: "high", status: "in_progress", assignedTo: "Rahul Mehta", assignedRole: "CRO", createdAt: "2024-03-03T14:30:00Z", dueDate: "2024-03-05T14:30:00Z", auditTrailId: "AUD-2024-7815" },
  { id: "w004", vendorId: "v004", vendorName: "CloudSec Systems", title: "Verify CVE-2024-1187 patch status", priority: "high", status: "pending_review", assignedTo: "Priya Sharma", assignedRole: "CISO", createdAt: "2024-03-02T10:00:00Z", dueDate: "2024-03-04T10:00:00Z", auditTrailId: "AUD-2024-7810" },
  { id: "w005", vendorId: "v007", vendorName: "PaySwitch Pro", title: "SLA breach root cause analysis", priority: "medium", status: "open", assignedTo: "Vendor Risk Team", assignedRole: "Vendor Risk", createdAt: "2024-03-01T11:15:00Z", dueDate: "2024-03-06T11:15:00Z", auditTrailId: "AUD-2024-7805" },
  { id: "w006", vendorId: "v010", vendorName: "ComplianceFirst", title: "Update data processing agreement — DPDP", priority: "medium", status: "open", assignedTo: "Anil Kumar", assignedRole: "Compliance", createdAt: "2024-02-28T17:00:00Z", dueDate: "2024-03-10T17:00:00Z", auditTrailId: "AUD-2024-7798" },
];

export const complianceData: ComplianceStatus[] = [
  { regulation: "RBI IT Outsourcing Directions 2023", category: "RBI", score: 67, status: "partial", lastChecked: "2024-03-04", gaps: ["Board reporting frequency below quarterly threshold", "3 vendors missing right-to-audit clause", "Material outsourcing register incomplete"] },
  { regulation: "CERT-In Cyber Incident Reporting", category: "CERT-In", score: 48, status: "non_compliant", lastChecked: "2024-03-04", gaps: ["6-hour reporting workflow not fully automated", "2 critical vendors lack incident notification SLA", "Dark web monitoring coverage at 60%"] },
  { regulation: "DPDP Act 2023", category: "DPDP", score: 58, status: "partial", lastChecked: "2024-03-03", gaps: ["PII vendor exposure mapping incomplete", "Data processing agreements need updating for 8 vendors", "Breach notification workflow not DPDP-aligned"] },
  { regulation: "RBI Cybersecurity Framework", category: "RBI", score: 72, status: "partial", lastChecked: "2024-03-02", gaps: ["SOC 2 compliance verification pending for 4 vendors", "Security posture monitoring gaps in Tier 2 vendors"] },
  { regulation: "SEBI / MCA21 Monitoring", category: "SEBI", score: 79, status: "compliant", lastChecked: "2024-03-01", gaps: ["Filing anomaly detection latency above 24 hours for MCA21"] },
];

export const riskTrendData = [
  { date: "Feb 04", score: 68, critical: 0, high: 5, watch: 18 },
  { date: "Feb 11", score: 66, critical: 0, high: 6, watch: 20 },
  { date: "Feb 18", score: 64, critical: 1, high: 7, watch: 22 },
  { date: "Feb 25", score: 62, critical: 1, high: 8, watch: 25 },
  { date: "Mar 01", score: 60, critical: 1, high: 9, watch: 28 },
  { date: "Mar 04", score: 58, critical: 2, high: 11, watch: 34 },
];

export const dimensionLabels: Record<string, string> = {
  cybersecurity: "Cybersecurity Posture",
  regulatory: "Regulatory Compliance",
  operational: "Operational Resilience",
  newsLegal: "News & Legal",
  financialHealth: "Financial Health",
  dataPrivacy: "Data Privacy",
  concentration: "Concentration Risk",
  esg: "ESG Risk",
  fourthParty: "Fourth-Party Exposure",
};

export function getRiskBandColor(band: RiskBand): string {
  switch (band) {
    case "critical": return "text-risk-critical-foreground";
    case "high": return "text-risk-high";
    case "watch": return "text-risk-watch";
    case "stable": return "text-risk-stable";
  }
}

export function getRiskBandBg(band: RiskBand): string {
  switch (band) {
    case "critical": return "bg-risk-critical";
    case "high": return "bg-risk-high/10";
    case "watch": return "bg-risk-watch/10";
    case "stable": return "bg-risk-stable/10";
  }
}

export function getRiskBandLabel(band: RiskBand): string {
  switch (band) {
    case "critical": return "CRITICAL";
    case "high": return "HIGH RISK";
    case "watch": return "WATCH";
    case "stable": return "STABLE";
  }
}
