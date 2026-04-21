import { EventOccurrence } from "@/types/index";

const CONFIRMATION_STRING = "yes";

export async function fetchPlayers(): Promise<string[]> {
  // load event page
  const res = await fetch(
    "https://api.sejdemse.net/api/teams-page/Fotbal-cajkarna.json",
    { cache: "no-store" },
  );

  if (!res.ok) throw new Error("Failed to fetch events");

  const data = await res.json();

  // get the first event's first upcoming occurrence ID
  const occurrenceId = data?.events?.[0]?.upcomingOccurrence?.id;

  if (!occurrenceId) {
    throw new Error("No upcoming occurrence found");
  }

  // load specific occurrence details
  const occRes = await fetch(
    `https://api.sejdemse.net/api/event_occurrences/${occurrenceId}.json`,
    { cache: "no-store" },
  );

  if (!occRes.ok) throw new Error("Failed to fetch occurrence");

  const occData = await occRes.json();

  // extract and return player names who confirmed attendance
  return extractPlayers(occData);
}

function extractPlayers(data: EventOccurrence): string[] {
  return (data?.participators ?? [])
    .filter((p) => p.isComing === CONFIRMATION_STRING)
    .map((p) => {
      const first = p.member?.firstName ?? "";
      const last = p.member?.lastName ?? "";
      return `${first.trim()} ${last.trim()}`.trim();
    })
    .filter(Boolean);
}
