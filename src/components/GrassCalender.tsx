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
        "bg-gren-50 dark:bg-green-950",
        "bg-gren-200 dark:bg-green-800",
        "bg-gren-400 dark:bg-green-600",
        "bg-gren-600 dark:bg-green-400",
        "bg-gren-800 dark:bg-green-300",
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
    data: string;
    total: number;
    byType: Record<string, number>;
    dominantType: string;
};

function getLevel(minutes: number, maxMinutes: number): number {
    if (minutes === 0) return 0;
    if (maxMinutes === 0) return 1;
    const ratio = minutes / maxMinutes;
    if (ratio <= 0.1) return 0;
    if (ratio <= 0.25) return 1;
}