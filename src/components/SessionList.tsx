"use client";

import type { Session } from "@/src/types";

type SessionListProps = {
  sessions: Session[];
  loading: boolean;
  onDelete: (id: string) => void;
};

export default function SessionList({
  sessions,
  loading,
  onDelete,
}: SessionListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`rounded-xl border-l-8 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900 ${
            session.type === "study" ? "border-blue-500" : "border-green-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold capitalize text-gray-800 dark:text-zinc-100">
                {session.type}
              </h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                {session.date}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {session.duration}
                </span>
                <span className="ml-1 text-sm text-gray-500">min</span>
              </div>
              <button
                onClick={() => onDelete(session.id)}
                className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                aria-label="Delete record"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          {session.note && (
            <p className="mt-3 text-gray-600 dark:text-zinc-300">
              {session.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
