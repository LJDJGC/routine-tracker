"use client"

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
  getDoc,
  query,
  where,
} from "firebase/firestore";

export default function Home() { }