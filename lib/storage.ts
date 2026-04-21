// lib/storage.ts

import { Draw } from "@/types";

const KEY = "football_draw_v1";

export function saveDraw(draw: Draw) {
  localStorage.setItem(KEY, JSON.stringify(draw));
}

export function loadDraw(): Draw | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}