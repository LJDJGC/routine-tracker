# Routine Tracker - Project Context

## プロダクト概要
- **名称**: Routine Tracker（学習 × 筋トレ × 英語イマージョン 統合トラッカー）
- **コンセプト**: 「文武両道 + 英語習得の最適化」。精神的研鑽（学習）・身体的研鑽（筋トレ）・英語イマージョン（YouTube視聴）の3軸を可視化し、次の行動を導き出す意思決定支援ツール。
- **ターゲットユーザー**: Comprehensible Input・イマージョン学習でYouTube英語動画をひたすら見ている学習者
- **現在のフェーズ**: Firebase + Google OAuth認証実装済み・Firestore移行中

---

## 技術スタック
| 技術 | バージョン | 選定理由 |
|------|-----------|---------|
| Next.js | 15 (App Router) | 高速な画面遷移と開発効率 |
| TypeScript | 最新 | 型安全性・堅牢な設計 |
| Tailwind CSS | v4 | 条件付きクラスで直感的なUI実装 |
| Firebase | 最新 | Auth・Firestore・無料枠が使いやすい |

> **補足**: Next.jsとの相性ではSupabase（PostgreSQL）がトレンド。
> Firebase完成後にSupabaseへの移行を検討中。面接では技術選定の理由として説明できる。

---

## ディレクトリ構成
```
src/
├── app/          # Next.js App Router
├── types/
│   └── index.ts  # Session型など、ドメインモデル定義
├── lib/
│   └── firebase.ts  # Firebase初期化・auth・db・googleProvider
└── components/   # UIコンポーネント
```

### 核となる型定義（src/types/index.ts）
```typescript
type SessionType = 'study' | 'workout';

interface Session {
  id: string;
  type: SessionType;
  duration: number; // 分
  date: string;     // ISO 8601
  note?: string;
}
```

---

## 実装済み機能
- [x] プロジェクト基盤（クリーンアップ済み）
- [x] Session型定義（src/types/index.ts）
- [x] 動的な一覧表示（.map()でカード形式）
- [x] プロフェッショナルREADME
- [x] 新規記録フォーム（CRUDの"C"）
- [x] 削除機能（CRUDの"D"）
- [x] localStorage永続化
- [x] Firebase導入・Google OAuth認証
- [x] Vercelデプロイ

## 今後実装予定の機能（優先順位順）

### STEP 1：Firestoreへのデータ移行（完了）
- [x] Firebase導入
- [x] Google OAuth 認証
- [x] データをlocalStorageからFirestoreへ移行

### STEP 2：草の可視化
- [ ] 日付ごとのセッションデータを集計
- [ ] カレンダー形式でヒートマップ表示（GitHubの草のようなUI）

### STEP 3：YouTube Data API連携（イマージョン学習の可視化）
- [ ] Google OAuthでYouTubeアカウントと連携
- [ ] YouTube Data API v3で視聴履歴を取得
- [ ] 視聴時間・チャンネル・動画をFirestoreに保存
- [ ] 英語学習の視聴時間をグラフ・草で可視化
- [ ] 「今日何時間英語を聴いたか」をダッシュボードに表示

### STEP 4：AI機能
- [ ] Gemini APIを使ったルーティンアドバイス機能
- [ ] 学習・筋トレ・YouTube視聴データをAIに渡して改善提案を表示
- [ ] 「今週は英語視聴が少ないです。明日30分追加しましょう」など

---

## Gitブランチ運用
| ブランチ | 役割 |
|---------|------|
| `main` | 安定版 |
| `draft/*` | AIによるお手本コード |
| `feat/handson-*` | 手打ち写経・自己研鑽 |
| `feat/recall-*` | コメントなしで復習・定着確認用 |
| `wip:` | 作業途中のコミットメッセージ prefix |

---

## 学習スタイル（必ず守ること）

### 学習の流れ（毎回このステップで進める）
- STEP 1: AIにコードを生成してもらう（draft/ブランチ）
- STEP 2: AIに1行ずつわかりやすく説明してもらう
- STEP 3: 理解できたら説明を見ながら写経する（feat/handson-ブランチ）
- STEP 4: 全行に自分の言葉でコメントを書く
- STEP 5: AIにコメントを見せて理解の正誤確認をしてもらう
- STEP 6: （復習）コメントを消して feat/recall- ブランチで再度書けるか確認

1. **AIのコードをそのまま使わない**
   AIが生成したコードは必ず `draft/` ブランチで受け取る。
   そのまま使わず、`feat/handson-` ブランチで必ず手打ちで写経すること。
   「動いた」ではなく「自分の手で書けた＋コメントが書けた」が合格ライン。

2. **1行ずつ説明してもらう**
   AIの説明は必ず初心者でもわかる言葉で。
   難しい場合は「もっとわかりやすく説明してください」と遠慮なく再依頼する。

3. **全行にコメントを書く**
   写経後、全ての行に「なぜこう書くのか」を自分の言葉でコメントとして書き込む。
   コメントが書けない行は「理解していない行」。書けるまで次に進まない。
   例: `// useStateでformDataという箱を作る。初期値は空文字`

4. **AIに理解の正誤確認をしてもらう**
   コメントを書き終えたら、AIに見せて「この理解は合っていますか？」と確認する。
   間違っている部分・補足が必要な部分を指摘してもらい、コメントを修正する。

5. **型から入る**
   画面（UI）を作る前に、必ずデータの「型（Type）」を定義する。
   「どんなデータを扱うか」が決まってから「どう見せるか」を考える順番を守る。

6. **Tech Lead視点で常に問い直す**
   コードが動いたら終わりではなく、以下を自分に問いかける。
   - 「そのロジックを選んだ理由と、他の代替案は何か？」
   - 「このコードの弱点は何か？」
   - 「このコードに潜在的なセキュリティ脆弱性やパフォーマンスのボトルネックはないか？」
   - 「もしユーザー数が100倍になったら、どう修正するか？」

---

## AIへの指示原則
- 「答え」ではなく「思考プロセス」を教えること
- コードは実務レベルの可読性・保守性・型安全性を維持
- 「動いた」で満足させず、エッジケースまで掘り下げる
- 理解できたか確認するため、逆質問やクイズを出すこと

---

## TILドキュメント運用
- 保存先: `/home/ljdjgc/dev/my-til-log/logs/YYYY-MM-DD.md`
- 日本語で作成 → `git commit -m "docs: add TIL YYYY-MM-DD"`
- 英訳を末尾に追記 → `git commit -m "Added English translation to logs"`
- 週次レビュー: `/home/ljdjgc/dev/my-til-log/logs/weekly/YYYY-WXX.md`

---

## キャリア情報
- **年齢**: [年齢]
- **現職**: [企業名A]／[現職]
- **現年収**: [想定年収]（ボーナス込み）
- **実務経験の強み**:
  - Python による業務改善・自動化（3000人規模）
  - PowerShell・コマンドプロンプトによるキッティング自動化
  - OEM Windowsキッティングマスターイメージ作成
  - この「泥臭い課題解決力」をWeb開発に翻訳してアピール

---

## 目標
- **最終目標**: [キャリア目標]
- **直近目標**: [転職時期目標]
- **ターゲット**: 自社開発のみ70社に応募（SES・受託は除外）
- **条件**: モダンな技術選定（React / Next.js / TypeScript 等）
- **年収目標**: [想定年収帯]（現年収維持以上）
- **カジュアル面談開始**: [転職活動開始時期]

---

## 年間スケジュール（最短内定ルート）
| 時期 | 内容 |
|------|------|
| 4月後半 | TypeScript習得 |
| 5月 | CRUD実装・Firebase・Google OAuth・Firestore移行 |
| 6月前半 | 草の可視化・YouTube Data API連携 |
| 6月後半 | AI機能・ポートフォリオ完成・GitHub整備 |
| 7月 | カジュアル面談開始・応募開始（Tier 1：30社） |
| 8月 | 追加応募（Tier 2-3：40社）・面接ラッシュ |
| [内定時期] | 内定獲得・入社準備 |

---

## 技術ロードマップ
| カテゴリ | 技術 |
|---------|------|
| Frontend | React 18, TypeScript 5, Next.js (App Router), Tailwind CSS |
| Backend (BaaS) | Firebase (Auth, Firestore) → Supabase移行検討中 |
| 外部API | YouTube Data API v3, Gemini API |
| Quality | Vitest, ESLint, Prettier, GitHub Actions |

---

## 戦略方針（AIへの判断基準）
- 「早期転職」より「良質な自社開発企業への入社」を優先（生涯年収LTV最大化）
- ポートフォリオの評価基準は「動くもの」ではなく**「保守性が高く、テストされたコード」**
- 70社応募の確率論前提。不採用はデータとして処理
- AIのコードは1行残らず面接で説明できる理解力を必須とする
- **スケジュールを常に意識した優先度判断をすること**
  例：「テストは今必要か？」→ 6月後半まで不要、その時期に追加

---

## 規律
- [就寝・起床時間]
- 日曜日は学習休み（パートナーとの時間を確保）
- 英語ドキュメント運用（シリコンバレー志向）