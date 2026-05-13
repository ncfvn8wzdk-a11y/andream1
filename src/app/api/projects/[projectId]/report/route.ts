import { NextRequest, NextResponse } from "next/server";
import { Packer } from "docx";
import { prisma } from "@/lib/prisma";
import { generateProjectReportDocument } from "@/lib/report-generator";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;

    // Fetch project with all related data
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        timeLogs: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Prepare report data
    const reportInput = {
      projectName: project.name,
      commessa: project.commessa || undefined,
      description: project.description || undefined,
      businessBenefit: project.businessBenefit || undefined,
      createdAt: project.createdAt,
      closedAt: project.closedAt || undefined,
      members: project.members.map((pm) => ({
        name: pm.user.name,
        role: pm.role,
      })),
      timeLogs: project.timeLogs.map((tl) => ({
        userName: project.members.find((pm) => pm.userId === tl.userId)?.user.name || "Unknown",
        hours: tl.hours,
        date: tl.date,
        description: tl.description || undefined,
      })),
    };

    // Generate document
    const doc = generateProjectReportDocument(reportInput);
    const buffer = await Packer.toBuffer(doc);

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Project_Report_${project.name.replace(/\s+/g, "_")}.docx"`,
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
