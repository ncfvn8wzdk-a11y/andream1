import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
      include: {
        owner: { select: { id: true, name: true } },
        members: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        timeLogs: true,
        costs: true,
        milestones: {
          orderBy: { plannedDate: "asc" },
        },
        punchList: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error("Error fetching project overview:", error);
    return NextResponse.json(
      { error: "Failed to fetch project overview" },
      { status: 500 }
    );
  }
}
