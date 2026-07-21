"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { Session } from "@/src/types";
import GrassCalendar from "@/src/components/GrassCalendar";
import { getSupabase } from "@/src/lib/supabase";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [newType, setNewType] = useState<Session["type"]>("study");
  const [newDuration, setNewDuration] = useState<number>(0);
  const [newDate, setNewDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [newNote, setNewNote] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSessions = useCallback(async () => {
    if (!isSignedIn || !user) return;
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });
      if (!error && data) {
        setSessions(data as Session[]);
      }
    } catch (e) {
      console.error("Supabase 未設定:", e);
    }
    setLoading(false);
  }, [isSignedIn, user]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchSessions();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, fetchSessions]);

  const addSession = async () => {
    if (newDuration <= 0 || !user) return;
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("sessions")
        .insert({
          user_id: user.id,
          type: newType,
          duration: newDuration,
          date: newDate,
          note: newNote || "",
        })
        .select()
        .single();
      if (!error && data) {
        setSessions((prev) => [data as Session, ...prev]);
        setNewDuration(0);
        setNewNote("");
      }
    } catch (e) {
      console.error("Supabase 未設定:", e);
    }
  };

  const removeSession = async (id: string) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("sessions").delete().eq("id", id);
      if (!error) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error("Supabase 未設定:", e);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Routine Tracker</h1>
          <p className="text-gray-600">
            学習と筋トレの記録を可視化しよう
          </p>
          <SignInButton mode="modal">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Google でログイン
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-8 px-4 py-8 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Routine Tracker</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {user.emailAddresses?.[0]?.emailAddress ?? user.id}
          </span>
          <SignOutButton>
            <button className="text-sm text-red-500 hover:text-red-700">
              ログアウト
            </button>
          </SignOutButton>
        </div>
      </div>

      <GrassCalendar sessions={sessions} />

      <section className="border rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-semibold">セッションを追加</h2>
        <div className="flex flex-wrap gap-2">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="study">学習</option>
            <option value="workout">筋トレ</option>
          </select>
          <input
            type="number"
            placeholder="時間（分）"
            value={newDuration || ""}
            onChange={(e) => setNewDuration(Number(e.target.value))}
            className="border rounded px-3 py-2 w-32"
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="メモ（任意）"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="border rounded px-3 py-2 flex-1 min-w-40"
          />
          <button
            onClick={addSession}
            disabled={newDuration <= 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            追加
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">履歴</h2>
        {loading ? (
          <p className="text-gray-500">読み込み中...</p>
        ) : sessions.length === 0 ? (
          <p className="text-gray-500">まだ記録がありません</p>
        ) : (
          sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between border rounded p-3"
            >
              <div className="flex gap-4 items-center">
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded ${
                    s.type === "study"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {s.type === "study" ? "学習" : "筋トレ"}
                </span>
                <span className="text-sm text-gray-600">{s.date}</span>
                <span className="font-medium">{s.duration}分</span>
                {s.note && (
                  <span className="text-sm text-gray-500">{s.note}</span>
                )}
              </div>
              <button
                onClick={() => removeSession(s.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                削除
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
