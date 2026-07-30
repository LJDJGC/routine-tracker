"use client";

import { useState, useEffect } from "react";
import { Session } from "@/src/types";
import { auth, db, googleProvider } from "@/src/lib/firebase";
import GrassCalendar from "@/src/components/GrassCalendar";
import AuthButtons from "@/src/components/AuthButtons";
import SessionForm from "@/src/components/SessionForm";
import SessionList from "@/src/components/SessionList";
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
} from "firebase/firestore";

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => (!auth || !db ? false : true));

  useEffect(() => {
    if (!auth || !db) return;

    const firestore = db;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const localData = localStorage.getItem("sessions");
        if (localData) {
          setSessions(JSON.parse(localData));
          setLoading(false);
        } else {
          setLoading(false);
        }

        // Firestore はバックグラウンドで試行（失敗しても localStorage が残る）
        (async () => {
          try {
            const q = query(
              collection(firestore, "sessions"),
              where("userId", "==", currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const firestoreSessions: Session[] = [];
            querySnapshot.forEach((docSnap) => {
              const data = docSnap.data();
              firestoreSessions.push({
                id: docSnap.id,
                type: data.type,
                duration: data.duration,
                date: data.date,
                note: data.note,
              });
            });

            const localData2 = localStorage.getItem("sessions");
            if (localData2) {
              const localSessions = JSON.parse(localData2) as Session[];
              if (localSessions.length > 0) {
                for (const localSession of localSessions) {
                  const docRef = doc(collection(firestore, "sessions"));
                  await setDoc(docRef, {
                    userId: currentUser.uid,
                    type: localSession.type,
                    duration: localSession.duration,
                    date: localSession.date,
                    note: localSession.note || "",
                  });
                  firestoreSessions.push({
                    id: docRef.id,
                    type: localSession.type,
                    duration: localSession.duration,
                    date: localSession.date,
                    note: localSession.note,
                  });
                }
                localStorage.removeItem("sessions");
              }
            }
            setSessions(firestoreSessions);
          } catch (error) {
            console.error(
              "Firestore 同期失敗（localStorage で継続）:",
              error
            );
          }
        })();
      } else {
        const localData = localStorage.getItem("sessions");
        if (localData) {
          setSessions(JSON.parse(localData));
        } else {
          const initialData: Session[] = [
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
          ];
          setSessions(initialData);
          localStorage.setItem("sessions", JSON.stringify(initialData));
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (!auth || !googleProvider) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleFormSubmit = (data: {
    type: Session["type"];
    duration: number;
    date: string;
    note: string;
  }) => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      ...data,
    };

    const updated = [...sessions, newSession];
    setSessions(updated);
    localStorage.setItem("sessions", JSON.stringify(updated));

    if (user && db) {
      setDoc(doc(collection(db, "sessions")), {
        userId: user.uid,
        ...data,
      }).catch((error) => {
        console.error("Firestore 保存失敗:", error);
      });
    }
  };

  const handleDelete = (id: string) => {
    const updated = sessions.filter((session) => session.id !== id);
    setSessions(updated);
    localStorage.setItem("sessions", JSON.stringify(updated));

    if (user && db) {
      deleteDoc(doc(db, "sessions", id)).catch((error) => {
        console.error("Firestore 削除失敗:", error);
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-8 dark:bg-zinc-950">
      <main className="w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Learning Records
          </h1>
          <AuthButtons
            user={user}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />
        </div>

        <div className="mb-8">
          <GrassCalendar sessions={sessions} />
        </div>

        <SessionForm onSubmit={handleFormSubmit} />

        <SessionList
          sessions={sessions}
          loading={loading}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
