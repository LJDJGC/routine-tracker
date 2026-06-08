"use client";

import { useState, useEffect } from "react"; /* ReactからuseStateとuseEffectをインポートPythonでいうとライブラリみたいな感じかな？ */
import { Session } from "@/src/types";
import { auth, db, googleProvider } from "@/src/lib/firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore"; /* firebaseカラ同期するためのデータベースとグーグルのプロバイダーをインポート、またfirebaseのfirestoreカラいろんな動詞をインポートしている。 */

export default function Home() {
  const [newType, setNewType] = useState<Session["type"]>("study"); /* newTypeという変数を遷延して、勉強というtypeを初期設定する*/
  const [newDuration, setNewDuration] = useState<number>(0);
  const [newDate, setNewDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [newNote, setNewNote] = useState<string>(""); /*  newDate, newNoteの変数を定義し、Dateでは文字列にしてTという分け方をしている。splitをつかってるので。Noteのほうは初期値に空白を設定しています。*/

  const [sessions, setSessions] = useState<Session[]>([]); /* sessionsという変数を定義している。[]は空白で定義。 */
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); /* userという変数を定義、ログインしているUserがあればそれで、なければnullで表す。loadingはtrueでローディングさせる。*/

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser); /* 現在のログインしているユーザーを読み込んでる */
      setLoading(true); /* ローディング中 */

      if (currentUser) { /* もし、ログインしているのなら */
        try {
          const q = query(
            collection(db, "sessions"), /* データベースからsessionというものを持ってくる */
            where("userId", "==", currentUser.uid) /* 現在のユーザーIDを探す */
          );
          const querySnapshot = await getDocs(q); /* 待たせている？qを持ってきている */
          const firestoreSessions: Session[] = []; /* firestoreのセッションを空白で定義している */
          querySnapshot.forEach((docSnap) => { /* それそれのデータを持ってくる */
            const data = docSnap.data(); /*　データにdocSnapとあるがdocSnapとは何をするのか？  */
            firestoreSessions.push({
              id: docSnap.id,
              type: data.type,
              duration: data.duration,
              date: data.date,
              note: data.note,
            }); /* データを持ってきて、firestoreSessionsにプッシュする。 */
          });

          const localData = localStorage.getItem("sessions"); /* localstorageにsessionsのデータを持ってくる。*/
          if (localData) {
            const localSessions = JSON.parse(localData) as Session[]; /* もし、ローカルデータがあるのなら、JSON.parseでlocaldataをSession[]として変換する*/
            if (localSessions.length > 0) { /* もしローカルセッションが０よりも多いのなら */
              for (const localSession of localSessions) {
                const docRef = doc(collection(db, "sessions")); /* localSessionsのうちのlocalSessionを１つずつ取り出し、db, sessionsにdocする。docとは何かわからない */
                await setDoc(docRef, { /* awaitで待たせて、setDocでdocRefのデータをなにかしているが、Docは何をしているのか？*/
                  userId: currentUser.uid,
                  type: localSession.type,
                  duration: localSession.duration,
                  date: localSession.date,
                  note: localSession.note || "",
                }); /* ユーザーID、タイプ、時間、日付、ノートを取り出している？ */
                firestoreSessions.push({
                  id: docRef.id,
                  type: localSession.type,
                  duration: localSession.duration,
                  date: localSession.date,
                  note: localSession.note,
                }); /* firestoreSessionsにid, type, duration, date, noteをプッシュ*/
              }
              localStorage.removeItem("sessions"); /* localStorageカラsessionsを取り除く*/
            }
          }
          setSessions(firestoreSessions);
        } catch (error) {
          console.error("Error syncing firestore:", error);
        } /* firestoreSessionsをセットしエラーを掴んで、エラー内容を吐き出す*/
      } else { /* ログインしていないのなら*/
        const localData = localStorage.getItem("sessions"); /*sessionsから取り出してlocalStorageに収める。 */
        if (localData) { // localDataがあるのなら
          setSessions(JSON.parse(localData)); //setSessionsでlocalDataをJSON形式で書かれた文字列をJSONオブジェクトに変換する。
        } else { // localDataがないのなら、
          const initialData = [ //initialDataの変数を定義、初期値みたいなもの
            {
              id: "1",
              type: "study",
              duration: 60,
              date: "2024-04-23",
              note: "Next.js learning",
            },
            {
              id: "2",
              type: "workout",
              duration: 45,
              date: "2024-04-22",
              note: "Upper body",
            },
            {
              id: "3",
              type: "study",
              duration: 120,
              date: "2024-04-21",
              note: "Tailwind CSS deep dive",
            },
          ]; //3つのデータを例にしておく。
          setSessions(initialData); // initialDtaをsetSessionsに定義する。
          localStorage.setItem("sessions", JSON.stringify(initialData)); //localStorageにsessions, initialDataをJSON文字列に変換したものをセットする。
        }
      }
      setLoading(false); //ローディングがfalseで止まる
    });

    return () => unsubscribe(); //unsubscribeを返す。
  }, []);

  const handleSignIn = async () => { //handleSignInという関数を定義、asyncで非同期のことを書くのかな。
    try {
      await signInWithPopup(auth, googleProvider); // awaitで待たせ、authで同期。googleProviderでgoogleログインをする。
    } catch (error) {
      console.error("Sign in failed:", error); //エラーが出た場合のメッセージ
    }
  };

  const handleSignOut = async () => { //handleSignOutという非同期の関数を定義
    try {
      await signOut(auth); //awaitでまたせ、同期でサインアウトさせる。
    } catch (error) {
      console.error("Sign out failed:", error); //エラーメッセージ
    }
  };

  const handleSubmit = async (e: React.FormEvent) => { //
    e.preventDefault();

    if (user) {
      try {
        const docRef = doc(collection(db, "sessions"));
        const newSessionData = {
          userId: user.uid,
          type: newType,
          duration: newDuration,
          date: newDate,
          note: newNote,
        };
        await setDoc(docRef, newSessionData);
        const newSession: Session = {
          id: docRef.id,
          type: newType,
          duration: newDuration,
          date: newDate,
          note: newNote,
        };
        setSessions([...sessions, newSession]);
      } catch (error) {
        console.error("Error adding to Firestore:", error);
      }
    } else {
      const newSession: Session = {
        id: crypto.randomUUID(),
        type: newType,
        duration: newDuration,
        date: newDate,
        note: newNote,
      };
      const updated = [...sessions, newSession];
      setSessions(updated);
      localStorage.setItem("sessions", JSON.stringify(updated));
    }

    setNewType("study");
    setNewDuration(0);
    setNewDate(new Date().toISOString().split("T")[0]);
    setNewNote("");
  };

  const handleDelete = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, "sessions", id));
        setSessions(sessions.filter((session) => session.id !== id));
      } catch (error) {
        console.error("Error deleting from Firestore:", error);
      }
    } else {
      const updated = sessions.filter((session) => session.id !== id);
      setSessions(updated);
      localStorage.setItem("sessions", JSON.stringify(updated));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-8 dark:bg-zinc-950">
      <main className="w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Learning Records
          </h1>
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-zinc-400">
                  {user.displayName}
                </span>
                <button
                  onClick={handleSignOut}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>

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
              name="type"
              id="type"
              value={newType}
              onChange={(e) => setNewType(e.target.value as Session["type"])}
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
              value={newDuration}
              onChange={(e) => setNewDuration(Number(e.target.value))}
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
              name="date"
              id="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
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
              name="note"
              id="note"
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Add Record
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`rounded-xl border-l-8 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900 ${session.type === "study" ? "border-blue-500" : "border-green-500"
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
                      onClick={() => handleDelete(session.id)}
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
        )}
      </main>
    </div>
  );
} 