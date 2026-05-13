import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const timeLogs = await prisma.timeLog.findMany({
      where: { projectId: params.projectId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ data: timeLogs });
  } catch (error) {
    console.error("Error fetching time logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch time logs" },
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
    const { userId, hours, date, description } = body;

    if (!userId || !hours || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const timeLog = await prisma.timeLog.create({
      data: {
        userId,
        projectId: params.projectId,
        hours: parseFloat(hours),
        date: new Date(date),
        description: description || undefined,
      },
    });

    return NextResponse.json({ data: timeLog }, { status: 201 });
  } catch (error) {
    console.error("Error creating time log:", error);
    return NextResponse.json(
      { error: "Failed to create time log" },
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
    const logId = searchParams.get("id");

    if (!logId) {
      return NextResponse.json({ error: "Log ID required" }, { status: 400 });
    }

    const log = await prisma.timeLog.findUnique({
      where: { id: logId },
    });

    if (!log || log.projectId !== params.projectId) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    await prisma.timeLog.delete({
      where: { id: logId },
    });

    return NextResponse.json({ message: "Log deleted" });
  } catch (error) {
    console.error("Error deleting time log:", error);
    return NextResponse.json(
      { error: "Failed to delete time log" },
      { status: 500 }
    );
  }
}
