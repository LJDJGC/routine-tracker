"use client";

import type { User } from "firebase/auth";

type AuthButtonsProps = {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
};

export default function AuthButtons({
  user,
  onSignIn,
  onSignOut,
}: AuthButtonsProps) {
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-zinc-400">
          {user.displayName}
        </span>
        <button
          onClick={onSignOut}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onSignIn}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
    >
      Sign In with Google
    </button>
  );
}
