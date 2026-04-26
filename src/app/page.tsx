//import Image from "next/image"
import { Session } from "@/src/types";

export default function Home() {
  const dummySessions: Session[] = [
    { id: "1", type: "study", duration: 60, date: "2024-04-23", note: "Next.js learning" },
    { id: "2", type: "workout", duration: 45, date: "2024-04-22", note: "Upper body" },
    { id: "3", type: "study", duration: 120, date: "2024-04-21", note: "Tailwind CSS deep dive" },
  ];

  return (
    // <div className="flex min-h-screen flex-col items-center justfy-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
    //   <h1 className="text-7xl md:text-8xl font-extrabold text-while drop-shadow-2xl tracking-tight">
    //     Hello World
    //   </h1>
    // </div>
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-8 dark:bg-zinc-950">
      <main className="w-full max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
          Learning Records
        </h1>

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