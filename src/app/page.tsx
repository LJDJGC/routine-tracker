"use client";

import { useState } from "react";
import { Session } from "@/src/types";

export default function Home() {
  const [newType, setNewType] = useState<Session['type']>('study');
  const [newDuration, setNewDuration] = useState<number>(0);
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newNote, setNewNote] = useState<string>('');

  const [sessions, setSessions] = useState<Session[]>(
    [
      { id: "1", type: "study", duration: 60, date: "2024-04-23", note: "Next.js learning" },
      { id: "2", type: "workout", duration: 45, date: "2024-04-22", note: "Upper body" },
      { id: "3", type: "study", duration: 120, date: "2024-04-21", note: "Tailwind CSS deep dive" },
    ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSession: Session = {
      id: crypto.randomUUID(),
      type: newType,
      duration: newDuration,
      date: newDate,
      note: newNote,
    };

    setSessions([...sessions, newSession]);

    setNewType('study');
    setNewDuration(0);
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewNote('');
  };


  const handleDelete = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id));
  };
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-8 dark:bg-zinc-950">
      <main className="w-full max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
          Learning Records
        </h1>

        <form onSubmit={handleSubmit} className="mb-8 rounded-xl bg-white p-6 shadow-md dark:bg-zinc-900">
          <div className="mb-4">
            <label htmlFor="type" className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Type
            </label>
            {/*2. onChangeハンドラー:
            ユーザーが入力を変えるたびに、(e) => setNewTypw(...) が実行され、
            Reactの状態(newType)を最新の入力値で更新します。*/}
            <select name="type" id="type" value={newType} onChange={(e) => setNewType(e.target.value as Session['type'])} className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
              <option value="study">Study</option>
              <option value="workout">Workout</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="duration" className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Duration (minutes)
            </label>
            <input type="number" id="duration" name="duration" min="1" value={newDuration} onChange={(e) => setNewDuration(Number(e.target.value))} className="w-fukk rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Date
            </label>
            <input type="date" name="date" id="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          </div>

          <div className="mb-6">
            <label htmlFor="note" className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Note
            </label>
            <textarea name="note" id="note" rows={3} value={newNote} onChange={(e) => setNewNote(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"></textarea>
          </div>

          <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800">
            Add Record
          </button>
        </form>

        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`rounded-xl border-l-8 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900 ${session.type === "study"
                ? "border-blue-500"
                : "border-green-500"
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
                {/* <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {session.duration}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">min</span> */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {session.duration}
                    </span>
                    <span className="ml-1 text-sm textgray-500">min</span>
                  </div>
                  {/* 削除ボタンの追加 */}
                  <button onClick={() => handleDelete(session.id)} className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30" aria-label="Delete record">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l 867 12.142A2 2 0 0116. 138 21H7. 862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10v4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
      </main >
    </div >

  );
} 