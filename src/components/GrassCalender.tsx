"use client";

import { useMemo } from "react";
import type { Session } from "@/src/types";


const TYPE_COLORS: Record<string, string[]> = {
    study: [
        "bg-blue-50 dark:bg-blue-950",
        "bg-blue-200 dark:bg-blue-800",
        "bg-blue-400 dark:bg-blue-600",
        "bg-blue-800 dark:bg-blue-200",
    ],
    workout: [
        "bg-gren-50 dark:bg-green-950",
        "bg-gren-200 dark:bg-green-800",
        "bg-gren-400 dark:bg-green-600",
    ]
}