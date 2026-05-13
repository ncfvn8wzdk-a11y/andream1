export type UserRole = "owner" | "lead" | "member";

export type ProjectStatus = "active" | "on-hold" | "completed" | "archived";

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
  status: ProjectStatus;
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
