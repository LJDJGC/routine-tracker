// Search.list をプロキシするRoute Handler。APIキーをサーバーサイドに隠蔽する
import { NextRequest, NextResponse } from "next/server";

// YouTube Data API v3 Search.list のレスポンス型（使用するフィールドのみ）
interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium?: { url: string };
      default?: { url: string };
    };
  };
}

interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[];
  error?: { message: string };
}

// アプリ内で使用する整形済み検索結果の型
export interface YouTubeVideoResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  // クエリパラメータのバリデーション
  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  // APIキーのチェック
  // NEXT_PUBLIC_ プレフィックスなし = サーバーサイドのみ参照可能
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "YouTube API key is not configured. Add YOUTUBE_API_KEY to .env.local",
      },
      { status: 500 }
    );
  }

  try {
    // YouTube Data API v3 Search.list エンドポイント
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("maxResults", "10");
    url.searchParams.set("type", "video");

    const response = await fetch(url.toString());
    const data: YouTubeSearchResponse = await response.json();

    // APIエラーハンドリング（レート制限・クォータ超過など）
    if (!response.ok) {
      console.error("YouTube API error:", data.error);
      return NextResponse.json(
        {
          error: data.error?.message || "Failed to search YouTube",
        },
        { status: response.status }
      );
    }

    // クライアントに返す最小限のデータに整形
    const results: YouTubeVideoResult[] = (data.items || []).map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl:
        item.snippet.thumbnails?.medium?.url ||
        item.snippet.thumbnails?.default?.url ||
        "",
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("YouTube search failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
