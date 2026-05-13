// Timezone utilities - all dates are stored in UTC in the database
// Conversion happens only when displaying to users

export function convertUTCToUserTimezone(date: Date, userTimezone: string): Date {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const mapped = Object.fromEntries(parts.map((p) => [p.type, p.value]));

  return new Date(
    `${mapped.year}-${mapped.month}-${mapped.day}T${mapped.hour}:${mapped.minute}:${mapped.second}`
  );
}

export function formatDateForDisplay(date: Date, userTimezone: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: userTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Check if current time falls within overlap window (15:00-18:00 IT / 09:00-12:00 EST)
export function isInOverlapWindow(
  date: Date,
  userTimezone: string,
  referenceTimezone: string = "Europe/Rome"
): boolean {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: referenceTimezone,
    hour: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);

  // Overlap: 15:00-18:00 in reference timezone (IT)
  return hour >= 15 && hour < 18;
}
