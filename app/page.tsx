import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <h1 className="text-7xl md:text-8xl font-extrabold text-white drop-shadow-2xl tracking-tight">
        Hello World
      </h1>
    </div>
  );
}
