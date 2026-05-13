import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const items = await prisma.punchListItem.findMany({
      where: { projectId: params.projectId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("Error fetching punch list:", error);
    return NextResponse.json(
      { error: "Failed to fetch punch list" },
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
    const { title, description, severity, status, foundDuring, dueDate } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const item = await prisma.punchListItem.create({
      data: {
        projectId: params.projectId,
        title,
        description: description || undefined,
        severity: severity || "minor",
        status: status || "open",
        foundDuring: foundDuring || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });

    // Log activity
    const severityLabel = {
      critical: "Critico",
      major: "Maggiore",
      minor: "Minore",
      cosmetic: "Cosmetico",
    }[severity || "minor"];

    await logActivity(
      params.projectId,
      "punch_added",
      `[${severityLabel}] ${title}`,
      `Item aggiunto alla punch list${foundDuring ? ` (trovato durante ${foundDuring})` : ""}`
    );

    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    console.error("Error creating punch list item:", error);
    return NextResponse.json(
      { error: "Failed to create punch list item" },
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
    const itemId = searchParams.get("id");
    const body = await req.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID required" },
        { status: 400 }
      );
    }

    const item = await prisma.punchListItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.projectId !== params.projectId) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.punchListItem.update({
      where: { id: itemId },
      data: {
        title: body.title || undefined,
        description: body.description,
        severity: body.severity || undefined,
        status: body.status || undefined,
        foundDuring: body.foundDuring,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        closedAt:
          body.status === "closed" && !item.closedAt ? new Date() : undefined,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Error updating punch list item:", error);
    return NextResponse.json(
      { error: "Failed to update punch list item" },
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
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID required" },
        { status: 400 }
      );
    }

    const item = await prisma.punchListItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.projectId !== params.projectId) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    await prisma.punchListItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: "Item deleted" });
  } catch (error) {
    console.error("Error deleting punch list item:", error);
    return NextResponse.json(
      { error: "Failed to delete punch list item" },
      { status: 500 }
    );
  }
}
