import { NextRequest, NextResponse } from "next/server";
import { Packer } from "docx";
import { prisma } from "@/lib/prisma";
import { generateMeetingReportDocument } from "@/lib/meeting-report-generator";
import { PROJECT_PHASES } from "@/lib/project-config";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;

    // Fetch all project data
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: {
            user: true,
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
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Calculate metrics
    const totalHours = project.timeLogs.reduce((sum, log) => sum + log.hours, 0);
    const totalCosts = project.costs.reduce((sum, cost) => sum + cost.amount, 0);

    const hoursByPerson = project.members
      .map((member) => ({
        name: member.user.name,
        hours: project.timeLogs
          .filter((log) => log.userId === member.userId)
          .reduce((sum, log) => sum + log.hours, 0),
      }))
      .filter((p) => p.hours > 0)
      .sort((a, b) => b.hours - a.hours);

    const openPunchItems = project.punchList.filter(
      (p) => p.status !== "closed"
    ).length;
    const closedPunchItems = project.punchList.filter(
      (p) => p.status === "closed"
    ).length;

    // Get phase label
    const phaseLabel =
      PROJECT_PHASES[project.currentPhase as keyof typeof PROJECT_PHASES]?.label ||
      project.currentPhase;

    // Prepare report data
    const reportInput = {
      projectName: project.name,
      commessa: project.commessa || undefined,
      currentPhase: phaseLabel,
      status: project.status,
      description: project.description || undefined,
      businessBenefit: project.businessBenefit || undefined,
      startDate: project.startDate || undefined,
      endDate: project.endDate || undefined,
      budget: project.budget || undefined,
      team: project.members.map((m) => ({
        name: m.user.name,
        role: m.role.replace(/_/g, " "),
      })),
      totalHours,
      hoursByPerson,
      totalCosts,
      milestones: project.milestones.map((m) => ({
        title: m.title,
        plannedDate: m.plannedDate,
        actualDate: m.actualDate || undefined,
        status: m.status,
      })),
      openPunchItems,
      closedPunchItems,
      generatedAt: new Date(),
    };

    // Generate document
    const doc = generateMeetingReportDocument(reportInput);
    const buffer = await Packer.toBuffer(doc);

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Meeting_Report_${project.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.docx"`,
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
