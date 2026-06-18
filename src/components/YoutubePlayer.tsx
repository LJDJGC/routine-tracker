"use client";

// YouTube動画を埋め込み再生するコンポーネント
// useYouTubePlayer フックを使って IFrame Player API を操作する
// フェーズ2（視聴時間の実測・Firestore保存）の布石として再生状態変化を親に通知する

import { useYouTubePlayer, type YouTubePlayerState } from "@/src/lib/useYouTubePlayer";

interface YoutubePlayerProps {
  videoId: string;
  onStateChange?: (state: YouTubePlayerState, durationSeconds: number) => void;
}

export default function YoutubePlayer({ videoId, onStateChange }: YoutubePlayerProps) {
  const { playerRef, playerState, isReady, play, pause } = useYouTubePlayer({
    videoId,
    onStateChange,
  });

  if (!videoId) return null;

  return (
    <div className="space-y-2">
      {/* プレイヤーコンテナ */}
      {/* useYouTubePlayerフックがこのdivを参照してYT.Playerを生成する */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <div
          ref={playerRef}
          className="h-full w-full"
        />
      </div>

      {/* 再生コントロール */}
      <div className="flex items-center gap-2">
        <button
          onClick={play}
          disabled={!isReady}
          className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {playerState === "playing" ? "再生中..." : "再生"}
        </button>
        <button
          onClick={pause}
          disabled={!isReady || playerState !== "playing"}
          className="rounded-md bg-gray-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          一時停止
        </button>

        {/* プレイヤーの状態表示 */}
        <span className="ml-auto text-xs text-gray-500 dark:text-zinc-400">
          ステータス:{" "}
          {playerState === "unstarted" && "未再生"}
          {playerState === "playing" && "再生中"}
          {playerState === "paused" && "一時停止"}
          {playerState === "ended" && "終了"}
          {playerState === "error" && "エラー"}
        </span>
      </div>
    </div>
  );
}
