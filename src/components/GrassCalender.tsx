"use client";

import { useMemo } from "react";
import type { Session } from "@/src/types";

const TYPE_COLORS: Record<string, string[]> = {
  study: [
    "bg-blue-50 dark:bg-blue-950",
    "bg-blue-200 dark:bg-blue-800",
    "bg-blue-400 dark:bg-blue-600",
    "bg-blue-600 dark:bg-blue-400",
    "bg-blue-800 dark:bg-blue-300",
  ],
  workout: [
    "bg-green-50 dark:bg-green-950",
    "bg-green-200 dark:bg-green-800",
    "bg-green-400 dark:bg-green-600",
    "bg-green-600 dark:bg-green-400",
    "bg-green-800 dark:bg-green-300",
  ],
};

const DEFAULT_COLORS = [
  "bg-gray-50 dark:bg-zinc-800",
  "bg-gray-200 dark:bg-zinc-700",
  "bg-gray-400 dark:bg-zinc-600",
  "bg-gray-600 dark:bg-zinc-500",
  "bg-gray-800 dark:bg-zinc-400",
];

type DayData = {
  date: string;
  total: number;
  byType: Record<string, number>;
  dominantType: string;
};

type Props = {
  sessions: Session[];
  weeks?: number;
};

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// useMemo x4 をここに書く（ヒント: sessions→dayMap, weeks→days, days→weeksList, weeksList→monthLabels）
// aggregateByDate / getLevel / formatMonthLabel を定義する
// JSX: 凡例 → カレンダーグリッド(月ラベル+週×日セル) → サマリーカード


function aggregateByDate(sessions: Session[]) {
  const map = new Map<string, DayData>();
  for (const session of sessions) {
    if (!map.has(session.date)) {
      map.set(session.date, {
        date: session.date,
        total: 0,
        byType: {},
        dominantType: "",
      });
    }
    const day = map.get(session.date)!;
    day.total += session.duration;
    day.byType[session.type] = (day.byType[session.type] || 0) + session.duration;
  }

  return map;
}

export default function GrassCalender({ sessions, weeks = 12 }: Props) {
  const dayMap = useMemo(() => aggregateByDate(sessions), [sessions]);
  function getLevel(dayData, type) {
    const value = dayData?.byType[type] ?? 0;
    if (value === 0) return 0;
    if (value <= 40) return 1;
    if (value <= 60) return 2;
    if (value <= 80) return 3;
    return 4;
  }
}

function formatMonthLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth();
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return MONTHS[month];
}

