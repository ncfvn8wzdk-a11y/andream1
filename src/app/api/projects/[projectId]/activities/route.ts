import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const activities = await prisma.activity.findMany({
      where: { projectId: params.projectId },
      orderBy: { createdAt: "desc" },
      take: 100, // Limit to last 100 activities
    });

    return NextResponse.json({ data: activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
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
    const { type, title, description, metadata, userId } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: "Type and title are required" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        projectId: params.projectId,
        type,
        title,
        description: description || undefined,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        userId: userId || undefined,
      },
    });

    return NextResponse.json({ data: activity }, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
