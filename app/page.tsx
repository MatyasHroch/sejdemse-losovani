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
      setLoading(false); // always stop loading state at the end
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
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <div className="max-w-3xl mx-auto p-6 space-y-6">

        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">
            ⚽ Fotbal losování
          </h1>
          <p className="text-white/40 text-sm">
            Automatické rozdělení týmů
          </p>
        </div>

        {draw?.date && (
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/50">
            ⏱️ Hráči naposledy načteni:{" "}
            <span className="text-white/70">
              {new Date(draw.date).toLocaleString("cs-CZ", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!draw && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-white/40">
              Žádné rozlosování zatím neexistuje
            </p>
          </div>
        )}

        {/* PLAYERS */}
        {draw && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h2 className="font-semibold mb-2 text-white/80">
              👥 Všichni hráči
            </h2>
            <p className="text-white/50 text-sm">
              {draw.allPlayers.join(" • ")}
            </p>
          </div>
        )}

        {/* TEAMS */}
        {draw && (
          <div className="space-y-4">

            {/* TEAM A */}
            <div className="rounded-2xl p-4 border border-red-500/30 bg-red-500/10">
              <h3 className="font-bold text-red-300 mb-1">
                🔴 Tým Červená
              </h3>
              <p className="text-white/70 text-sm">
                {draw.teamA.join(" • ")}
              </p>
            </div>

            {/* TEAM B */}
            <div className="rounded-2xl p-4 border border-green-500/30 bg-green-500/10">
              <h3 className="font-bold text-green-300 mb-1">
                🟢 Tým Zelená
              </h3>
              <p className="text-white/70 text-sm">
                {draw.teamB.join(" • ")}
              </p>
            </div>

          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">

          <button
            onClick={handleLoadAndDraw}
            disabled={loading}
            className="
            flex-1 px-5 py-3 rounded-xl font-bold
            bg-blue-600 hover:bg-blue-500
            transition active:scale-[0.98]
            shadow-lg shadow-blue-600/20
            disabled:opacity-40 disabled:cursor-not-allowed
          "
          >
            {loading ? "🎲 Načítám..." : "🎲 Načíst hráče a Rozlosovat"}
          </button>

          <button
            onClick={handleReshuffle}
            disabled={!draw || loading}
            className="
            flex-1 px-5 py-3 rounded-xl font-bold
            bg-white/10 hover:bg-white/15
            border border-white/10
            transition active:scale-[0.98]
            disabled:opacity-30 disabled:cursor-not-allowed
          "
          >
            🔁 Přerozdělit
          </button>
        </div>
      </div>
    </div>
  );
}