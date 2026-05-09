"use client";

import { useState } from "react";
import { Session } from "@/src/types";

export default function Home() {
  // 1. useStateフックの導入:
  //各入力フィールド(Type, Duration, Date, Note)の状態と、
  //セッション一覧の状態をReactで管理するために使用します。
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

  // 3. onSubmitハンドラーとe.preventDefault():
  // フォームが送信されたときに実行される関数です。
  const handleSubmit = (e: React.FormEvent) => {
    // e.preventDefault() はブラウザのデフォルトの挙動（ページのリロード）を停止させます。
    //これにより、Reactの状態を維持したままデータを追加できます。
    e.preventDefault();

    const newSession: Session = {
      id: crypto.randomUUID(),
      type: newType,
      duration: newDuration,
      date: newDate,
      note: newNote,
    };

    //4. スプレッド構文でのデータ追加ロジック：
    //[..sessions, newSession]は、現在のsessions配列の中身をすべて展開し、
    //最後に新しいnewSessionを追加した「新しい配列」を作成します。
    //Reactは新しい配列を受け取ることで変更を検知し、画面を再描画します。
    setSessions([...sessions, newSession]);

    //送信後、入力フォームを初期値にリセットします。
    setNewType('study');
    setNewDuration(0);
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewNote('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-8 dark:bg-zinc-950">
      <main className="w-full max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
          Learning Records
        </h1>

        <form className="mb-8 rounded-xl bg-white p-6 shadow-md dark:bg-zinc-900">
          <div className="mb-4">
            <label htmlFor="type" className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Type
            </label>
            <select name="type" id="type" className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
              <option value="study">Study</option>
              <option value="workout">Workout</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="duration" className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Duration (minutes)
            </label>
            <input type="number" id="duration" name="duration" min="1" className="w-fukk rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Date
            </label>
            <input type="date" name="date" id="date" className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          </div>

          <div className="mb-6">
            <label htmlFor="note" className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300">
              Note
            </label>
            <textarea name="note" id="note" rows={3} className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"></textarea>
          </div>

          <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800">
            Add Record
          </button>
        </form>

        <div className="space-y-4">
          {dummySessions.map((session) => (
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
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {session.duration}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">min</span>
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