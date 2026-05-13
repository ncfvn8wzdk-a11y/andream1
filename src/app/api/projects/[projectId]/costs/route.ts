import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const costs = await prisma.projectCost.findMany({
      where: { projectId: params.projectId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ data: costs });
  } catch (error) {
    console.error("Error fetching costs:", error);
    return NextResponse.json({ error: "Failed to fetch costs" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const vendor = formData.get("vendor") as string;
    const description = formData.get("description") as string;
    const date = new Date(formData.get("date") as string);

    if (!file || !documentType || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save file to public/uploads/costs/
    const uploadsDir = join(process.cwd(), "public/uploads/costs");
    await mkdir(uploadsDir, { recursive: true });

    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = join(uploadsDir, fileName);
    const fileUrl = `/uploads/costs/${fileName}`;

    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    // Create cost record in database
    const cost = await prisma.projectCost.create({
      data: {
        projectId: params.projectId,
        fileName: file.name,
        fileUrl,
        documentType,
        amount,
        vendor: vendor || undefined,
        description: description || undefined,
        date,
        uploadedBy: "PLACEHOLDER", // Will be replaced with session user after auth setup
      },
    });

    return NextResponse.json({ data: cost }, { status: 201 });
  } catch (error) {
    console.error("Error creating cost:", error);
    return NextResponse.json(
      { error: "Failed to upload cost document" },
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
    const costId = searchParams.get("id");

    if (!costId) {
      return NextResponse.json({ error: "Cost ID required" }, { status: 400 });
    }

    const cost = await prisma.projectCost.findUnique({
      where: { id: costId },
    });

    if (!cost || cost.projectId !== params.projectId) {
      return NextResponse.json({ error: "Cost not found" }, { status: 404 });
    }

    // Delete file
    try {
      const filePath = join(process.cwd(), "public", cost.fileUrl);
      const { unlink } = await import("fs/promises");
      await unlink(filePath).catch(() => {}); // Ignore if file doesn't exist
    } catch {}

    // Delete from database
    await prisma.projectCost.delete({
      where: { id: costId },
    });

    return NextResponse.json({ message: "Cost deleted" });
  } catch (error) {
    console.error("Error deleting cost:", error);
    return NextResponse.json(
      { error: "Failed to delete cost" },
      { status: 500 }
    );
  }
}
