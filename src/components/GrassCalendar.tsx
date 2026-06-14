"use client";

import { useMemo } from "react";
import type { Session } from "@/src/types";

// 各タイプの色設定（shadeレベル: 0〜4）
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

// デフォルト色（該当タイプがない場合）
const DEFAULT_COLORS = [
  "bg-gray-50 dark:bg-zinc-800",
  "bg-gray-200 dark:bg-zinc-700",
  "bg-gray-400 dark:bg-zinc-600",
  "bg-gray-600 dark:bg-zinc-500",
  "bg-gray-800 dark:bg-zinc-400",
];

// 1日の集計データ
type DayData = {
  date: string;       // "YYYY-MM-DD"
  total: number;      // 合計時間（分）
  byType: Record<string, number>; // タイプごとの時間
  dominantType: string; // 最も多かったタイプ
};

// 各タイプの強度レベルを計算（0〜4）
function getLevel(minutes: number, maxMinutes: number): number {
  if (minutes === 0) return 0;
  if (maxMinutes === 0) return 1;
  const ratio = minutes / maxMinutes;
  if (ratio <= 0.1) return 0;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

// 日単位でデータを集計
function aggregateByDate(sessions: Session[]): Map<string, DayData> {
  const map = new Map<string, DayData>();

  for (const s of sessions) {
    if (!map.has(s.date)) {
      map.set(s.date, {
        date: s.date,
        total: 0,
        byType: {},
        dominantType: "",
      });
    }
    const day = map.get(s.date)!;
    day.total += s.duration;
    day.byType[s.type] = (day.byType[s.type] || 0) + s.duration;
  }

  // 支配的なタイプを計算
  for (const day of map.values()) {
    let maxType = "";
    let maxVal = 0;
    for (const [type, val] of Object.entries(day.byType)) {
      if (val > maxVal) {
        maxVal = val;
        maxType = type;
      }
    }
    day.dominantType = maxType;
  }

  return map;
}

// 年月のラベルを生成（例: "2026年6月"）
function formatMonthLabel(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

// 曜日の日本語表記
const WEEKDAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

type Props = {
  sessions: Session[];
  weeks?: number; // 表示する週数（デフォルト12週=約3ヶ月）
};

export default function GrassCalendar({ sessions, weeks = 12 }: Props) {
  // 集計データと最大値をメモ化
  const { dayMap, maxDayMinutes } = useMemo(() => {
    const map = aggregateByDate(sessions);
    let max = 0;
    for (const day of map.values()) {
      if (day.total > max) max = day.total;
    }
    return { dayMap: map, maxDayMinutes: max };
  }, [sessions]);

  // 表示期間の日付配列を生成
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result: Date[] = [];
    const totalDays = weeks * 7;
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      result.push(d);
    }
    return result;
  }, [weeks]);

  // 週ごとに分割（7日ずつ）
  const weeksList = useMemo(() => {
    const list: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      list.push(days.slice(i, i + 7));
    }
    return list;
  }, [days]);

  // 月のラベルを計算（最初の週のみ表示）
  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string }[] = [];
    let lastMonth = -1;
    weeksList.forEach((week, idx) => {
      const month = week[6] ? week[6].getMonth() : week[0].getMonth();
      if (month !== lastMonth) {
        labels.push({ index: idx, label: formatMonthLabel(week[0]) });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeksList]);

  function dateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-zinc-100">
        アクティビティ
      </h2>

      {/* 凡例 */}
      <div className="mb-3 flex items-center gap-4 text-xs text-gray-500 dark:text-zinc-400">
        <span>少</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className={`inline-block h-3 w-3 rounded-sm ${DEFAULT_COLORS[level]}`}
          />
        ))}
        <span>多</span>
        <span className="ml-2">|</span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-blue-400" />
          Study
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-green-400" />
          Workout
        </span>
      </div>

      {/* カレンダーグリッド */}
      <div className="flex gap-1">
        {/* 月ラベル */}
        <div className="flex flex-col justify-start gap-0 pt-5 text-xs text-gray-400 dark:text-zinc-500">
          {monthLabels.map((m) => (
            <span key={m.index} style={{ marginTop: m.index === 0 ? 0 : 14 }}>
              {m.label}
            </span>
          ))}
        </div>

        {/* 週のグリッド */}
        <div className="flex gap-1">
          {weeksList.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((d) => {
                const dk = dateKey(d);
                const dayData = dayMap.get(dk);
                const total = dayData?.total || 0;
                const dominantType = dayData?.dominantType || "";
                const colors = TYPE_COLORS[dominantType] || DEFAULT_COLORS;
                const level = getLevel(total, maxDayMinutes);

                const isToday =
                  d.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={dk}
                    title={`${dk}: ${total > 0 ? `${total}分` : "記録なし"}`}
                    className={`h-3 w-3 rounded-sm ${colors[level]} ${isToday ? "ring-2 ring-blue-400 ring-offset-1 dark:ring-offset-zinc-900" : ""}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* サマリー */}
      {dayMap.size > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              学習合計
            </p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {Array.from(dayMap.values()).reduce(
                (sum, d) => sum + (d.byType["study"] || 0),
                0
              )}
              <span className="ml-1 text-sm font-normal">分</span>
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              筋トレ合計
            </p>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">
              {Array.from(dayMap.values()).reduce(
                (sum, d) => sum + (d.byType["workout"] || 0),
                0
              )}
              <span className="ml-1 text-sm font-normal">分</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
