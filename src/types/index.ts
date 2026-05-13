export type UserRole = "project_leader" | "project_support" | "supervisor";

export type ProjectStatus = "active" | "on-hold" | "completed" | "archived" | "closed";

export type ProjectType = "plant" | "production_line" | "retrofit" | "maintenance";

export type ProjectPhase =
  | "concept"
  | "basic_eng"
  | "detail_eng"
  | "procurement"
  | "build"
  | "fat"
  | "installation"
  | "sat"
  | "training"
  | "handover";

const PHASE_ORDER: Record<ProjectPhase, number> = {
  concept: 1,
  basic_eng: 2,
  detail_eng: 3,
  procurement: 4,
  build: 5,
  fat: 6,
  installation: 7,
  sat: 8,
  training: 9,
  handover: 10,
};

export type FileType = "invoice" | "drawing" | "photo" | "pdf" | "other";

export interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  commessa?: string;
  description?: string;
  businessBenefit?: string;
  projectType: ProjectType;
  currentPhase: ProjectPhase;
  budget?: number;
  status: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  closedAt?: Date;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectReportData {
  project: Project;
  members: (ProjectMember & { user: User })[];
  timeLogs: TimeLog[];
  totalHours: number;
}

export interface ProjectCost {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  documentType: "invoice" | "order" | "estimate" | "other";
  amount: number;
  vendor?: string;
  description?: string;
  date: Date;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  plannedDate: Date;
  actualDate?: Date;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface PunchListItem {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  severity: "critical" | "major" | "minor" | "cosmetic";
  status: "open" | "in-progress" | "closed";
  foundDuring?: "FAT" | "SAT" | "installation" | "other";
  assignedTo?: string;
  dueDate?: Date;
  closedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  projectId: string;
  type: "phase_change" | "milestone_update" | "cost_added" | "hours_logged" | "punch_added" | "file_uploaded";
  title: string;
  description?: string;
  metadata?: string;
  userId?: string;
  createdAt: Date;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: UserRole;
  joinedAt: Date;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TimeLog {
  id: string;
  userId: string;
  projectId: string;
  hours: number;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
