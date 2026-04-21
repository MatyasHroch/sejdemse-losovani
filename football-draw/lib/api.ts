// lib/api.ts

export async function fetchPlayers(): Promise<string[]> {
  const res = await fetch(
    "https://api.sejdemse.net/api/teams-page/Fotbal-cajkarna.json",
    { cache: "no-store" },
  );

  if (!res.ok) throw new Error("API error");

  const data = await res.json();

  return extractPlayers(data);
}

function extractPlayers(data: any): string[] {
  // ⚠️ uprav podle reálné struktury
  // TODO: přidat typy pro data z API
  return (data?.players ?? []).map((p: any) => p.name).filter(Boolean);
}
