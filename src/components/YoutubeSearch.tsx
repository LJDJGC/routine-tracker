"use client";

// YouTube動画を検索するコンポーネント
// キーワード入力 → API Route経由でYouTube Data APIを呼び出す
// 検索結果から動画を選択すると onSelect で親コンポーネントに通知する

import { useState, useCallback } from "react";
import type { YouTubeVideoResult } from "@/src/app/api/youtube/search/route";

interface YoutubeSearchProps {
  onSelect: (video: YouTubeVideoResult) => void;
}

export default function YoutubeSearch({ onSelect }: YoutubeSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YouTubeVideoResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setError(null);

    try {
      // Route Handlerを経由してYouTube Data API v3を呼び出す
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(trimmed)}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Search failed");
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  // Enterキーでも検索できるようにする
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  return (
    <div className="space-y-4">
      {/* 検索入力エリア */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="YouTubeで英語動画を検索..."
          className="flex-1 rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          disabled={isSearching}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="rounded-md bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSearching ? "検索中..." : "検索"}
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* 検索結果リスト */}
      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((video) => (
            <li key={video.videoId}>
              <button
                onClick={() => onSelect(video)}
                className="flex w-full gap-3 rounded-lg bg-white p-2 text-left shadow-sm transition hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                {/* サムネイル */}
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="h-16 w-24 flex-shrink-0 rounded object-cover"
                  loading="lazy"
                />
                {/* 動画情報 */}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-white">
                    {video.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                    {video.channelTitle}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 検索結果が空の場合 */}
      {!isSearching && results.length === 0 && query && !error && (
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          検索結果が見つかりませんでした
        </p>
      )}
    </div>
  );
}
