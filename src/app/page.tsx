"use client";

import { useState, useEffect } from "react";
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
} from "firebase/firestore";

export default function Home() {
  const [newType, setNewType] = useState<Session["type"]>("study");
  const [newDuration, setNewDuration] = useState<number>(0);
  const [newDate, setNewDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [newNote, setNewNote] = useState<string>("");

  const [sessions, setSessions] = useState<Session[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        try {
          const q = query(
            collection(db, "sessions"),
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

          const localData = localStorage.getItem("sessions");
          if (localData) {
            const localSessions = JSON.parse(localData) as Session[];
            if (localSessions.length > 0) {
              for (const localSession of localSessions) {
                const docRef = doc(collection(db, "sessions"));
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
          console.error("Error syncing firestore:", error);
        }
      } else {
        const localData = localStorage.getItem("sessions");
        if (localData) {
          setSessions(JSON.parse(localData));
        } else {
          const initialData = [
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
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const handleSignIn = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed.", error);
    }
  };

  const handleSubmit = async (e: React.DormEvent) => {
    e.preventDefault();

    if (user) {
      try {
        const docRef = doc(collection(db, "sessions"));
        const newSessionData = {
          userId: user.uid,
          type: newType,
          duration: newDuration,
          date: newData,
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
    }
  }

