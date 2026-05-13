import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  PageBreak,
} from "docx";

interface MeetingReportInput {
  projectName: string;
  commessa?: string;
  currentPhase: string;
  status: string;
  description?: string;
  businessBenefit?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  team: Array<{ name: string; role: string }>;
  totalHours: number;
  hoursByPerson: Array<{ name: string; hours: number }>;
  totalCosts: number;
  milestones: Array<{
    title: string;
    plannedDate: Date;
    actualDate?: Date;
    status: string;
  }>;
  openPunchItems: number;
  closedPunchItems: number;
  generatedAt: Date;
}

export function generateMeetingReportDocument(data: MeetingReportInput) {
  const sections = [
    // Title Page
    new Paragraph({
      text: "PROJECT STATUS REPORT",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: data.projectName,
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: `Generated: ${new Date(data.generatedAt).toLocaleDateString("it-IT")} at ${new Date(data.generatedAt).toLocaleTimeString("it-IT")}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      italic: true,
    }),

    // Executive Summary
    new Paragraph({
      text: "EXECUTIVE SUMMARY",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),

    new Paragraph({
      text: `Status: ${data.status}`,
      spacing: { after: 100 },
      bold: true,
    }),

    new Paragraph({
      text: `Current Phase: ${data.currentPhase}`,
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: `Total Project Hours: ${data.totalHours.toFixed(1)}h`,
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: `Total Costs: €${data.totalCosts.toFixed(2)}`,
      spacing: { after: 300 },
    }),

    // Project Details
    new Paragraph({
      text: "PROJECT DETAILS",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),

    ...(data.commessa
      ? [
          new Paragraph({
            text: `Commessa: ${data.commessa}`,
            spacing: { after: 100 },
          }),
        ]
      : []),

    ...(data.description
      ? [
          new Paragraph({
            text: `Description: ${data.description}`,
            spacing: { after: 100 },
          }),
        ]
      : []),

    ...(data.businessBenefit
      ? [
          new Paragraph({
            text: `Business Benefit: ${data.businessBenefit}`,
            spacing: { after: 100 },
          }),
        ]
      : []),

    new Paragraph({
      text: `Start Date: ${data.startDate ? new Date(data.startDate).toLocaleDateString("it-IT") : "N/A"}`,
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: `Target End Date: ${data.endDate ? new Date(data.endDate).toLocaleDateString("it-IT") : "N/A"}`,
      spacing: { after: 300 },
    }),

    // Financial Status
    new Paragraph({
      text: "FINANCIAL STATUS",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),

    new Paragraph({
      text: `Budget: €${data.budget ? data.budget.toFixed(2) : "Not set"}`,
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: `Actual Costs: €${data.totalCosts.toFixed(2)}`,
      spacing: { after: 300 },
    }),

    // Team
    new Paragraph({
      text: "TEAM",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "Name", bold: true })],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "Role", bold: true })],
            }),
          ],
        }),
        ...data.team.map(
          (member) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph(member.name)],
                }),
                new TableCell({
                  children: [new Paragraph(member.role)],
                }),
              ],
            })
        ),
      ],
    }),

    // Hours Summary
    new Paragraph({
      text: "HOURS SUMMARY",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),

    new Paragraph({
      text: `Total Hours: ${data.totalHours.toFixed(1)}h`,
      spacing: { after: 200 },
      bold: true,
    }),

    new Paragraph({
      text: "Hours by Person:",
      spacing: { after: 100 },
      bold: true,
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "Person", bold: true })],
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "Hours", bold: true })],
            }),
          ],
        }),
        ...data.hoursByPerson.map(
          (person) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph(person.name)],
                }),
                new TableCell({
                  children: [
                    new Paragraph(person.hours.toFixed(1) + "h"),
                  ],
                }),
              ],
            })
        ),
      ],
    }),

    // Milestones
    new Paragraph({
      text: "MILESTONES",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "Milestone", bold: true })],
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ text: "Planned", bold: true }),
              ],
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ text: "Actual", bold: true }),
              ],
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ text: "Status", bold: true }),
              ],
            }),
          ],
        }),
        ...data.milestones.map(
          (milestone) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph(milestone.title)],
                }),
                new TableCell({
                  children: [
                    new Paragraph(
                      new Date(milestone.plannedDate).toLocaleDateString(
                        "it-IT"
                      )
                    ),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph(
                      milestone.actualDate
                        ? new Date(milestone.actualDate).toLocaleDateString(
                            "it-IT"
                          )
                        : "-"
                    ),
                  ],
                }),
                new TableCell({
                  children: [new Paragraph(milestone.status)],
                }),
              ],
            })
        ),
      ],
    }),

    // Punch List Status
    new Paragraph({
      text: "PUNCH LIST STATUS",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),

    new Paragraph({
      text: `Open Items: ${data.openPunchItems}`,
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: `Closed Items: ${data.closedPunchItems}`,
      spacing: { after: 300 },
    }),

    // Footer
    new Paragraph({
      text: "---",
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 100 },
    }),

    new Paragraph({
      text: "End of Report",
      alignment: AlignmentType.CENTER,
      italic: true,
      spacing: { after: 100 },
    }),
  ];

  return new Document({ sections: [{ children: sections }] });
}
