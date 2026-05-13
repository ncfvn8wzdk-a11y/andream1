import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;

    // Update project status to closed
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: "closed",
        closedAt: new Date(),
      },
    });

    return NextResponse.json(
      { data: updatedProject, message: "Project closed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Project close error:", error);
    return NextResponse.json(
      { error: "Failed to close project" },
      { status: 500 }
    );
  }
}
