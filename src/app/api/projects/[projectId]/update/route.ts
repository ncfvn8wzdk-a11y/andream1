import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface UpdateProjectBody {
  name?: string;
  commessa?: string;
  description?: string;
  businessBenefit?: string;
  status?: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;
    const body: UpdateProjectBody = await req.json();

    // Build update object with only provided fields
    const updateData: UpdateProjectBody = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.commessa !== undefined) updateData.commessa = body.commessa;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.businessBenefit !== undefined)
      updateData.businessBenefit = body.businessBenefit;
    if (body.status !== undefined) updateData.status = body.status;

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    return NextResponse.json(
      { data: updatedProject, message: "Project updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
