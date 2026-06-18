// セッションのタイプ: 学習・筋トレ・YouTube視聴の3軸
export type SessionType = "study" | "workout" | "youtube";

// セッションの型定義
// YouTube動画視聴の場合は youtubeMetadata に動画情報を格納する
export interface Session {
  id: string;
  type: SessionType;
  duration: number; // 分（YouTube視聴の実測時間も分単位で統一）
  date: string; // YYYY-MM-DD形式
  note?: string;
  // YouTube視聴ログ専用のメタデータ（typeが"youtube"の場合のみ存在）
  youtubeMetadata?: {
    videoId: string; // YouTube動画ID（11桁の識別子）
    videoTitle: string; // 動画タイトル
    channelTitle?: string; // チャンネル名
    thumbnailUrl?: string; // サムネイルURL
  };
}