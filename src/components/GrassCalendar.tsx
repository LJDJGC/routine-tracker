"use client";

import { useMemo } from "react";
import type { Session } from "@/src/types";

type Props = {
    sessions: Session[];
    weeks?: number;
} //このコンポーネントは、sessions（Sessionの配列）と、weeks（数値、デフォルト12週間）を受け取る

type DayData = {
    total: number;
    dominantType: string;
    byType: Record<string, number>;
}

const getLevel = (minutes: number, maxMinutes: number): number => {
    if (minutes === 0) {
        return 0;
    } 

    if (maxMinutes === 0) {
        return 1;
    }

    const ratio = minutes / maxMinutes;
    if (ratio < 0.1) return 0;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
}