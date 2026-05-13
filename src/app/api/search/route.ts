import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const type = searchParams.get("type") ?? "all"; // all, costs, projects, milestones, punch
    const amountMin = searchParams.get("amountMin")
      ? parseFloat(searchParams.get("amountMin")!)
      : undefined;
    const amountMax = searchParams.get("amountMax")
      ? parseFloat(searchParams.get("amountMax")!)
      : undefined;
    const dateFrom = searchParams.get("dateFrom")
      ? new Date(searchParams.get("dateFrom")!)
      : undefined;
    const dateTo = searchParams.get("dateTo")
      ? new Date(searchParams.get("dateTo")!)
      : undefined;

    if (!q && type === "all" && !amountMin && !amountMax && !dateFrom && !dateTo) {
      return NextResponse.json({ data: { projects: [], costs: [], milestones: [], punchItems: [] } });
    }

    const textFilter = q
      ? { contains: q, mode: "insensitive" as const }
      : undefined;

    const results: {
      projects: any[];
      costs: any[];
      milestones: any[];
      punchItems: any[];
    } = {
      projects: [],
      costs: [],
      milestones: [],
      punchItems: [],
    };

    // --- PROJECTS ---
    if (type === "all" || type === "projects") {
      results.projects = await prisma.project.findMany({
        where: {
          OR: textFilter
            ? [
                { name: textFilter },
                { commessa: textFilter },
                { description: textFilter },
                { businessBenefit: textFilter },
              ]
            : undefined,
        },
        include: {
          owner: { select: { name: true } },
          _count: { select: { timeLogs: true, costs: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    }

    // --- COSTS (fatture, ordini, preventivi) ---
    if (type === "all" || type === "costs") {
      const costWhere: any = {
        AND: [
          textFilter
            ? {
                OR: [
                  { vendor: textFilter },
                  { description: textFilter },
                  { fileName: textFilter },
                ],
              }
            : undefined,
          amountMin !== undefined ? { amount: { gte: amountMin } } : undefined,
          amountMax !== undefined ? { amount: { lte: amountMax } } : undefined,
          dateFrom !== undefined ? { date: { gte: dateFrom } } : undefined,
          dateTo !== undefined ? { date: { lte: dateTo } } : undefined,
        ].filter(Boolean),
      };

      results.costs = await prisma.projectCost.findMany({
        where: costWhere,
        include: {
          project: { select: { id: true, name: true, commessa: true } },
        },
        orderBy: { date: "desc" },
        take: 50,
      });
    }

    // --- MILESTONES ---
    if (type === "all" || type === "milestones") {
      results.milestones = await prisma.milestone.findMany({
        where: textFilter
          ? {
              OR: [{ title: textFilter }, { description: textFilter }],
            }
          : undefined,
        include: {
          project: { select: { id: true, name: true, commessa: true } },
        },
        orderBy: { plannedDate: "desc" },
        take: 20,
      });
    }

    // --- PUNCH LIST ---
    if (type === "all" || type === "punch") {
      results.punchItems = await prisma.punchListItem.findMany({
        where: textFilter
          ? {
              OR: [{ title: textFilter }, { description: textFilter }],
            }
          : undefined,
        include: {
          project: { select: { id: true, name: true, commessa: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    }

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
