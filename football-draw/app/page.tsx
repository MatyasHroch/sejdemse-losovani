"use client";

import { useEffect, useState } from "react";
import { fetchPlayers } from "@/lib/api";
import { loadDraw, saveDraw } from "@/lib/storage";
import { createTeams } from "@/lib/teams";
import type { Draw } from "@/types";

export default function Page() {
  const [draw, setDraw] = useState<Draw | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadDraw();
    if (saved) setDraw(saved);
  }, []);

  async function handleLoadAndDraw() {
    setLoading(true);
    setError(null);

    try {
      const players = await fetchPlayers();

      if (players.length === 0) {
        setError("Žádní hráči k dispozici");
        return;
      }

      const teams = createTeams(players);

      const newDraw: Draw = {
        date: new Date().toISOString(),
        allPlayers: players,
        teamA: teams.teamA,
        teamB: teams.teamB,
      };

      saveDraw(newDraw);
      setDraw(newDraw);

    } catch (e) {
      setError("Nepodařilo se načíst hráče");
    } finally {
      setLoading(false); // 🔑 vždy se vypne
    }
  }

  function handleReshuffle() {
    if (!draw) return;

    const teams = createTeams(draw.allPlayers);

    const newDraw: Draw = {
      ...draw,
      date: new Date().toISOString(),
      teamA: teams.teamA,
      teamB: teams.teamB,
    };

    saveDraw(newDraw);
    setDraw(newDraw);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Fotbal losování</h1>

      {!draw && (
        <p className="text-gray-500">
          Žádné rozlosování není v local storage
        </p>
      )}

      {draw && (
        <>
          <div>
            <h2 className="font-semibold">Všichni hráči</h2>
            <p>{draw.allPlayers.join(", ")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-100 p-4 rounded">
              <h3 className="font-bold">Tým A</h3>
              <p>{draw.teamA.join(", ")}</p>
            </div>

            <div className="bg-green-100 p-4 rounded">
              <h3 className="font-bold">Tým B</h3>
              <p>{draw.teamB.join(", ")}</p>
            </div>
          </div>
        </>
      )}

      {error && (
        <p className="text-red-500 font-semibold">
          {error}
        </p>
      )}

      {!draw && (
        <p className="text-gray-500">
          Žádné rozlosování není v local storage
        </p>
      )}

      {draw && (
        <>
          {/* hráči + týmy */}
        </>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleLoadAndDraw}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Načítám..." : "Načíst hráče a rozdělit"}
        </button>

        <button
          onClick={handleReshuffle}
          disabled={!draw}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Přerozdělit
        </button>
      </div>
    </div>
  );
}