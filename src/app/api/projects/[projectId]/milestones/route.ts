import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const milestones = await prisma.milestone.findMany({
      where: { projectId: params.projectId },
      orderBy: { plannedDate: "asc" },
    });

    return NextResponse.json({ data: milestones });
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return NextResponse.json(
      { error: "Failed to fetch milestones" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await req.json();
    const { title, description, plannedDate, status } = body;

    if (!title || !plannedDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const milestone = await prisma.milestone.create({
      data: {
        projectId: params.projectId,
        title,
        description: description || undefined,
        plannedDate: new Date(plannedDate),
        status: status || "pending",
      },
    });

    // Log activity
    await logActivity(
      params.projectId,
      "milestone_update",
      `Milestone: ${title}`,
      `Milestone "${title}" creato per il ${new Date(plannedDate).toLocaleDateString("it-IT")}`
    );

    return NextResponse.json({ data: milestone }, { status: 201 });
  } catch (error) {
    console.error("Error creating milestone:", error);
    return NextResponse.json(
      { error: "Failed to create milestone" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const milestoneId = searchParams.get("id");
    const body = await req.json();

    if (!milestoneId) {
      return NextResponse.json(
        { error: "Milestone ID required" },
        { status: 400 }
      );
    }

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
    });

    if (!milestone || milestone.projectId !== params.projectId) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        title: body.title || undefined,
        description: body.description,
        plannedDate: body.plannedDate
          ? new Date(body.plannedDate)
          : undefined,
        status: body.status || undefined,
        actualDate:
          body.status === "completed" && !milestone.actualDate
            ? new Date()
            : undefined,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Error updating milestone:", error);
    return NextResponse.json(
      { error: "Failed to update milestone" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const milestoneId = searchParams.get("id");

    if (!milestoneId) {
      return NextResponse.json(
        { error: "Milestone ID required" },
        { status: 400 }
      );
    }

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
    });

    if (!milestone || milestone.projectId !== params.projectId) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }

    await prisma.milestone.delete({
      where: { id: milestoneId },
    });

    return NextResponse.json({ message: "Milestone deleted" });
  } catch (error) {
    console.error("Error deleting milestone:", error);
    return NextResponse.json(
      { error: "Failed to delete milestone" },
      { status: 500 }
    );
  }
}
