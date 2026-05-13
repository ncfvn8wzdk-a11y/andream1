import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CreateProjectBody {
  name: string;
  commessa?: string;
  description?: string;
  businessBenefit?: string;
  startDate?: string;
  endDate?: string;
  ownerId: string;
  members: Array<{ userId: string; role: string }>;
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateProjectBody = await req.json();

    if (!body.name || !body.ownerId) {
      return NextResponse.json(
        { error: "name and ownerId are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        commessa: body.commessa,
        description: body.description,
        businessBenefit: body.businessBenefit,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        ownerId: body.ownerId,
        members: {
          create: body.members.map((m) => ({
            userId: m.userId,
            role: m.role,
          })),
        },
      },
      include: {
        members: { include: { user: { select: { id: true, name: true } } } },
      },
    });

    return NextResponse.json({ data: project, message: "Project created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
