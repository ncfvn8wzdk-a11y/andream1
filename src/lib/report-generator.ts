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
  convertInchesToTwip,
} from "docx";

interface ProjectReportInput {
  projectName: string;
  commessa?: string;
  description?: string;
  businessBenefit?: string;
  createdAt: Date;
  closedAt?: Date;
  members: Array<{
    name: string;
    role: string;
  }>;
  timeLogs: Array<{
    userName: string;
    hours: number;
    date: Date;
    description?: string;
  }>;
}

export function generateProjectReportDocument(data: ProjectReportInput) {
  const totalHours = data.timeLogs.reduce((sum, log) => sum + log.hours, 0);

  // Calculate hours per person
  const hoursPerPerson = data.timeLogs.reduce(
    (acc, log) => {
      if (!acc[log.userName]) {
        acc[log.userName] = 0;
      }
      acc[log.userName] += log.hours;
      return acc;
    },
    {} as Record<string, number>
  );

  const durationDays = data.closedAt
    ? Math.ceil(
        (data.closedAt.getTime() - new Date(data.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : "N/A";

  const sections = [
    new Paragraph({
      text: "PROJECT REPORT",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    new Paragraph({
      text: `Project: ${data.projectName}`,
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 200 },
    }),

    ...(data.commessa
      ? [
          new Paragraph({
            text: `Commessa: ${data.commessa}`,
            spacing: { after: 200 },
          }),
        ]
      : []),

    new Paragraph({
      text: "PROJECT DETAILS",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 200 },
    }),

    ...(data.description
      ? [
          new Paragraph({
            text: `Description: ${data.description}`,
            spacing: { after: 200 },
          }),
        ]
      : []),

    ...(data.businessBenefit
      ? [
          new Paragraph({
            text: `Business Benefit: ${data.businessBenefit}`,
            spacing: { after: 200 },
          }),
        ]
      : []),

    new Paragraph({
      text: `Start Date: ${new Date(data.createdAt).toLocaleDateString()}`,
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: `End Date: ${data.closedAt ? new Date(data.closedAt).toLocaleDateString() : "Ongoing"}`,
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: `Duration: ${durationDays} days`,
      spacing: { after: 400 },
    }),

    new Paragraph({
      text: "TEAM MEMBERS",
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 200 },
    }),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          height: { value: 400, rule: "auto" },
          children: [
            new TableCell({
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 1,
                  color: "000000",
                },
                left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              },
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "Name", bold: true })],
            }),
            new TableCell({
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 1,
                  color: "000000",
                },
                left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              },
              width: { size: 25, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "Role", bold: true })],
            }),
            new TableCell({
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 1,
                  color: "000000",
                },
                left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              },
              width: { size: 25, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "Hours", bold: true })],
            }),
          ],
        }),
        ...data.members.map(
          (member) =>
            new TableRow({
              children: [
                new TableCell({
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: 1,
                      color: "000000",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: 1,
                      color: "000000",
                    },
                    left: {
                      style: BorderStyle.SINGLE,
                      size: 1,
                      color: "000000",
                    },
                    right: {
                      style: BorderStyle.SINGLE,
                      size: 1,
                      color: "000000",
                    },
                  },
                  children: [new Paragraph(member.name)],
                }),
                new TableCell({
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: 1,
                      color: "000000",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: 1,
                      color: "000000",
                    },
                    left: {
                      style: BorderStyle.SINGLE,
                      size: 1,
                      color: "000000",
                    },
                    right: {
                      style: BorderStyle.SINGLE,
                      size: 1,
                      color: "000000",
                    },
                  },
                  children: [new Paragraph(member.role)],
                }),
                new TableCell({
                  borders: {
                    top: {
                      style: BorderStyle.SINGLE,
                      size: 1,
                      color: "000000",
                    },
                    bottom: {
                      style: BorderStyle.SINGLE,
                      size: 1,
                      color: "000000",
                    },
                    left: {
                      style: BorderStyle.SINGLE,
                      size: 1,
                      color: "000000",
                    },
                    right: {
                      style: BorderStyle.SINGLE,
                      size: 1,
                      color: "000000",
                    },
                  },
                  children: [
                    new Paragraph(
                      (hoursPerPerson[member.name] || 0).toFixed(1)
                    ),
                  ],
                }),
              ],
            })
        ),
      ],
    }),

    new Paragraph({
      text: `Total Hours: ${totalHours.toFixed(2)}`,
      spacing: { before: 400, after: 400 },
      bold: true,
    }),
  ];

  return new Document({ sections: [{ children: sections }] });
}
