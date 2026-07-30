"use client";

import { useState } from "react";
import type { SessionType } from "@/src/types";

type FormData = {
  type: SessionType;
  duration: number;
  date: string;
  note: string;
};

type SessionFormProps = {
  onSubmit: (data: FormData) => void;
};

export default function SessionForm({ onSubmit }: SessionFormProps) {
  const [type, setType] = useState<SessionType>("study");
  const [duration, setDuration] = useState<number>(0);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ type, duration, date, note });
    setType("study");
    setDuration(0);
    setDate(new Date().toISOString().split("T")[0]);
    setNote("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-xl bg-white p-6 shadow-md dark:bg-zinc-900"
    >
      <div className="mb-4">
        <label
          htmlFor="type"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300"
        >
          Type
        </label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as SessionType)}
          className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        >
          <option value="study">Study</option>
          <option value="workout">Workout</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="duration"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300"
        >
          Duration (minutes)
        </label>
        <input
          type="number"
          id="duration"
          name="duration"
          min="1"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="date"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="note"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300"
        >
          Note
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Add Record
      </button>
    </form>
  );
}
