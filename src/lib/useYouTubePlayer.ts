// YouTube IFrame Player APIを管理するカスタムフック
// プレイヤーの生成・状態変化の購読・クリーンアップをカプセル化する

import { useEffect, useRef, useCallback, useState } from "react";

// YouTube IFrame Player APIの型定義
// グローバルに注入されるYTオブジェクトの型
declare global {
  interface Window {
    YT?: {
      Player: new (
        elementOrId: HTMLElement | string,
        config: {
          videoId?: string;
          height?: string | number;
          width?: string | number;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// YT.Playerのインスタンスメソッド型
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  getCurrentTime: () => number;
  destroy: () => void;
}

// YouTubeプレイヤーの状態
export type YouTubePlayerState = "unstarted" | "playing" | "paused" | "ended" | "error";

interface UseYouTubePlayerOptions {
  videoId: string | null;
  onStateChange?: (state: YouTubePlayerState, currentTime: number) => void;
}

interface UseYouTubePlayerReturn {
  playerRef: React.RefObject<HTMLDivElement | null>;
  playerState: YouTubePlayerState;
  isReady: boolean;
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
}

// YT.PlayerState 定数の代替（型安全に扱うため）
const PLAYER_STATE = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  UNSTARTED: -1,
} as const;

export function useYouTubePlayer({
  videoId,
  onStateChange,
}: UseYouTubePlayerOptions): UseYouTubePlayerReturn {
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const playerInstanceRef = useRef<YTPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [playerState, setPlayerState] = useState<YouTubePlayerState>("unstarted");

  // YT IFrame APIが読み込まれているか追跡
  const apiLoadedRef = useRef(false);

  // IFrame Player APIスクリプトを動的に読み込む
  useEffect(() => {
    // すでにロード済みまたは読み込み中の場合はスキップ
    if (apiLoadedRef.current || document.querySelector("#youtube-iframe-api")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "youtube-iframe-api";
    script.src = "https://www.youtube.com/iframe_api";
    // スクリプトを非同期で読み込む
    script.async = true;
    document.body.appendChild(script);

    apiLoadedRef.current = true;

    // クリーンアップ: コンポーネントアンマウント時にスクリプトは残すがプレイヤーは破棄
    return () => {
      playerInstanceRef.current?.destroy();
      playerInstanceRef.current = null;
    };
  }, []);

  // videoIdが変わるたびにプレイヤーを生成または読み込み
  useEffect(() => {
    if (!videoId || !playerContainerRef.current) return;

    // 既存のプレイヤーを破棄
    playerInstanceRef.current?.destroy();
    playerInstanceRef.current = null;
    setIsReady(false);
    setPlayerState("unstarted");

    // APIがまだロードされていない場合はポーリング
    const waitForAPI = () => {
      if (window.YT?.Player) {
        createPlayer();
      } else {
        // YT APIがロードされるまで100msごとにチェック
        const timeout = setTimeout(waitForAPI, 100);
        return () => clearTimeout(timeout);
      }
    };

    const createPlayer = () => {
      if (!playerContainerRef.current) return;

      const player = new window.YT!.Player(playerContainerRef.current, {
        videoId,
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            setIsReady(true);
          },
          onStateChange: (event: { data: number }) => {
            const currentTime = player.getCurrentTime();
            let state: YouTubePlayerState;

            switch (event.data) {
              case PLAYER_STATE.PLAYING:
                state = "playing";
                break;
              case PLAYER_STATE.PAUSED:
                state = "paused";
                break;
              case PLAYER_STATE.ENDED:
                state = "ended";
                break;
              default:
                state = "unstarted";
            }

            setPlayerState(state);
            onStateChange?.(state, currentTime);
          },
          onError: () => {
            setPlayerState("error");
          },
        },
      });

      playerInstanceRef.current = player;
    };

    waitForAPI();
  }, [videoId, onStateChange]);

  const play = useCallback(() => {
    playerInstanceRef.current?.playVideo();
  }, []);

  const pause = useCallback(() => {
    playerInstanceRef.current?.pauseVideo();
  }, []);

  const getCurrentTime = useCallback(() => {
    return playerInstanceRef.current?.getCurrentTime() ?? 0;
  }, []);

  return {
    playerRef: playerContainerRef,
    playerState,
    isReady,
    play,
    pause,
    getCurrentTime,
  };
}
