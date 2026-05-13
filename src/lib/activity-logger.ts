import { prisma } from "./prisma";

export async function logActivity(
  projectId: string,
  type:
    | "phase_change"
    | "milestone_update"
    | "cost_added"
    | "hours_logged"
    | "punch_added"
    | "file_uploaded",
  title: string,
  description?: string,
  metadata?: Record<string, any>,
  userId?: string
) {
  try {
    await prisma.activity.create({
      data: {
        projectId,
        type,
        title,
        description: description || undefined,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        userId: userId || undefined,
      },
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    // Don't throw - activity logging failure shouldn't break the main operation
  }
}
