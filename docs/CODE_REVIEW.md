# VoiceCamp コードレビュー・改善提案書

> シニアエンジニア視点による構造分析と改善事項のまとめ

---

## 1. プロジェクト概要

| 項目 | 内容 |
|------|------|
| フレームワーク | Deno + Fresh 1.6.1 (Islands Architecture) |
| UI | Preact 10.19.3 + Twind 0.16.19 |
| キャッシュ | Deno KV + Upstash Redis |
| ソースファイル数 | 約42ファイル / 約2,500行 |

---

## 2. 現在のディレクトリ構造

```
voicecamp/
├── routes/              # ページ・APIルート
│   ├── api/             # REST APIエンドポイント
│   ├── content/         # ポッドキャストコンテンツページ
│   ├── _app.tsx         # アプリシェル
│   ├── index.tsx        # トップページ
│   ├── form.tsx         # 登録フォーム
│   └── feelingLucky.tsx # ランダム選択
├── components/          # サーバーサイド描画コンポーネント
├── islands/             # クライアントサイド対話コンポーネント
├── domain/              # ビジネスロジック (API, キャッシュ, 型定義)
├── hook/                # カスタムフック
├── utils/               # ユーティリティ
├── e2e/                 # E2Eテスト (Playwright)
├── config.ts            # ポッドキャスト一覧設定 (628行)
├── main.ts              # エントリポイント
├── cron.ts              # 定期バッチ
└── deno.json            # Deno設定
```

---

## 3. 改善提案一覧

### 重要度の定義
- **Critical**: バグまたはセキュリティリスク。即座に対応すべき
- **High**: 保守性・信頼性に大きく影響。早期対応推奨
- **Medium**: コード品質・開発体験の向上
- **Low**: ベストプラクティスへの準拠

---

### 3.1 [Critical] キャッシュ削除APIに認証がない

**対象**: `routes/api/kv.ts`

```typescript
// 誰でもクエリパラメータ1つで全キャッシュを削除できる
const hasDeleteParam = !!new URL(_req.url).searchParams.get('delete')
if (hasDeleteParam) {
  await deleteCache(key)
  await deleteCacheAll()  // Redis全削除 (flushall)
}
```

**問題**: `/api/kv?delete=1` にアクセスするだけで、Deno KVとUpstash Redisの全キャッシュが削除される。外部からの悪意あるアクセスでサービスダウンにつながる。

**提案**:
- APIキーやBearerトークンによる認証を追加する
- cronジョブからの呼び出しは内部的なメカニズムに変更する（直接関数呼び出し等）


---

### 3.2 [Critical] getDescription APIに500秒のsleepが存在

**対象**: `routes/api/getDescription.ts:42`

```typescript
await new Promise((r) => setTimeout(() => r(1), 500000)) // 500秒待機
```

**問題**: キャッシュヒット時に500秒(約8分)のsleepが実行される。意図的なデバッグコードの消し忘れと思われるが、リクエストがタイムアウトまでハングし、サーバーリソースを消費する。

**提案**: この行を削除する。

---

### 3.3 [High] キャッシュ層の二重実装と不整合

**対象**: `domain/cache.ts` / `domain/cacheForUpstash.ts`

**問題**:
- `cache.ts` (Deno KV) と `cacheForUpstash.ts` (Upstash Redis) が同じインターフェースで別々に実装されている
- ルートによって使い分けが異なり、統一されていない
  - `routes/api/kv.ts`: Deno KVの`deleteCache` + Upstashの`deleteCacheAll`を混在使用
  - `routes/content/...`: Upstashの`getCache`/`pushCache`のみ使用
- 毎回 `Deno.openKv()` や `redisInit()` が呼ばれ、接続の再利用がない
- `isCacheOld` が両ファイルに同一コードとして重複しているが、どちらも使われていない

**提案**:
- キャッシュの抽象インターフェースを定義し、実装を差し替え可能にする
- 接続はシングルトンまたはモジュールレベルで初期化する

```typescript
// 例: domain/cache/interface.ts
export interface CacheProvider {
  get<T>(key: string): Promise<CacheEntry<T> | null>
  set<T>(key: string, data: T): Promise<void>
  delete(key: string): Promise<void>
}
```

---

### 3.4 [High] config.ts の肥大化 (628行のハードコード)

**対象**: `config.ts`

**問題**:
- 60以上のポッドキャスト定義が1ファイルにハードコードされている
- 追加・削除のたびにTypeScriptファイルを変更し、デプロイが必要
- コメントアウトされた無効なエントリが散在

**提案**:
- ポッドキャスト一覧をJSONまたはYAMLファイルに外出しする
- 将来的にはDBやCMSからの取得を検討
- コメントアウトされたエントリは削除するか、別ファイル(`archive.json`等)で管理する

---

### 3.5 [High] エラーハンドリングの不備

**対象**: 複数ファイル

**問題点と箇所**:

1. **`domain/api.ts`**: `fetch` のエラーハンドリングがない。ネットワーク障害時に未処理例外になる
2. **`routes/content/[podcastName]/index.tsx:50`**: `resp.json()` が失敗した場合のハンドリングがない
3. **`routes/content/[podcastName]/index.tsx:81`**: `pushCache` が `await` されているが、失敗してもリクエストへの応答には影響しないため、fire-and-forgetにするか try-catch で囲むべき
4. **`islands/TopList.tsx:18`**: `fetch('/api/getNewPodcast')` のエラーハンドリングなし。ネットワークエラー時に `.json()` で例外
5. **`routes/api/getDescription.ts:81`**: `error.message` にアクセスしているが `error` が `unknown` 型の可能性がある

**提案**:
- 外部API呼び出しにはtry-catchとフォールバック処理を追加
- fetch結果は `resp.ok` チェックを行う
- islandでのfetchにはエラー状態のUI表示を追加

---

### 3.6 [High] originのハードコード

**対象**: `routes/content/[podcastName]/index.tsx:52-54`, `routes/feelingLucky.tsx:13-15`

```typescript
const origin = url.origin === `https://wilf312-voicecamp.deno.dev`
  ? `https://voicecamp.love`
  : `http://localhost:8000`
```

**問題**: 本番・開発のorigin判定がハードコードされている。staging環境の追加やドメイン変更時に複数箇所の修正が必要。

**提案**:
- 環境変数 (`BASE_URL` 等) で管理する
- または `request.url` のoriginをそのまま使用する

---

### 3.7 [Medium] 型安全性の不足

**対象**: 複数ファイル

**問題**:
- `deno-lint-ignore no-explicit-any` が7箇所以上で使用されている
- `routes/content/[podcastName]/index.tsx:19`: `getCache<any>(key)` で型が完全に無効化
- `hook/usePlayer.tsx:92`: `onChange` の引数が `any`
- `domain/api.ts`: RSS APIレスポンスの型と実際のデータが一致しない可能性がある(optional fieldsの不足)

**提案**:
- `any` を具体的な型または `unknown` に置き換え、型ガードを導入する
- RSS APIレスポンスの型にバリデーション（zodなど）を追加する

---

### 3.8 [Medium] テストの不足

**対象**: プロジェクト全体

**問題**:
- ユニットテストが存在しない
- E2Eテストはサンプルのみ（`example.spec.ts`, `demo-todo-app.spec.ts`）
- ビジネスロジック（`domain/`配下）にテストがない
- `isCacheOld` のロジックは間違っている可能性があるがテストで検証されていない

**提案**:
- `domain/` の各関数にユニットテストを追加（特に `cache.ts`, `date.ts`, `episode.ts`）
- 主要ルートのインテグレーションテストを追加
- CI/CDでテスト実行を必須化

---

### 3.9 [Medium] `isCacheOld` のロジック不整合

**対象**: `domain/cache.ts:31-43`, `domain/cacheForUpstash.ts:70-82`

```typescript
export const isCacheOld = (cacheDate, options = { cacheTime: 60 * 60 * 4 }) => {
  const cacheTime = options.cacheTime // コメントは「1時間」だが、デフォルト値は4時間
  return (new Date(
    options.now.setSeconds(options.now.getSeconds() - cacheTime)
  )) < cacheDate  // trueならキャッシュが新しい = 関数名と返り値の意味が逆
}
```

**問題**:
1. 関数名 `isCacheOld` は「キャッシュが古いか」を問うが、返り値は「キャッシュが新しいならtrue」になっている
2. コメントの「1時間」とデフォルト値の4時間が不一致
3. `options.now.setSeconds()` は引数の `now` オブジェクトを変更する副作用がある
4. この関数は実際にはどこからも呼ばれていない

**提案**: 使われていないコードは削除する。必要になった際は名前・ロジック・テストを正しく実装する。

---

### 3.10 [Medium] 不要なimport・未使用コードの残存

**対象**: 複数ファイル

| ファイル | 内容 |
|----------|------|
| `routes/content/[podcastName]/[episode].tsx:16` | `import { parse, stringify } from 'yaml'` — 未使用 |
| `domain/cacheForUpstash.ts:51-61` | `getCacheBin` がコメントアウトされたまま残存 |
| `domain/cacheForUpstash.ts:4-5` | `msgpack`, `brotli` — `pushCacheBin` のみで使用、`getCacheBin` がないため片方向のみ |
| `routes/content/[podcastName]/[episode].tsx:56-74` | description キャッシュのコメントアウトコード |
| `islands/Counter.tsx` | サンプルコンポーネントが残存 |

**提案**: 未使用のimportとコメントアウトコードを削除する。

---

### 3.11 [Medium] コンポーネントの命名が機能と不一致

**対象**: `routes/content/[podcastName]/[episode].tsx:101`

```typescript
export default function GreetPage({ data }: PageProps<PageType | null>) {
```

**問題**: エピソード詳細ページなのに `GreetPage` という名前。Freshのテンプレートから変更されていない。

**提案**: `EpisodePage` に改名する。

---

### 3.12 [Medium] インラインスタイルの多用

**対象**: `islands/Player.tsx`, `islands/TopList.tsx`, `routes/content/[podcastName]/[episode].tsx`

**問題**:
- Twind (`tw`) とインライン `style` プロパティが混在している
- 同じスタイルパターンが複数箇所に重複（例: `backdropFilter: blur(...)`, `minHeight: 100svh`）

**提案**:
- TwindのCSS-in-JS機能に統一する
- 再利用するスタイルパターンはTwindのテーマまたはユーティリティクラスとして定義する

---

### 3.13 [Low] API レスポンスに Content-Type ヘッダーがない

**対象**: `routes/api/getDescription.ts`, `routes/api/getNewPodcast.ts`, `routes/api/kv.ts`

```typescript
return new Response(JSON.stringify(data))
// Content-Type が設定されていない
```

**提案**:
```typescript
return new Response(JSON.stringify(data), {
  headers: { 'Content-Type': 'application/json' },
})
```

---

### 3.14 [Low] cronジョブが外部HTTP経由でキャッシュ削除

**対象**: `cron.ts`

```typescript
Deno.cron('cron', '*/10 * * * *', async () => {
  const deleteUrl = `https://voicecamp.love/api/kv?delete=1`
  const res = await fetch(deleteUrl)
})
```

**問題**:
- 内部処理なのに本番URLへHTTPリクエストを発行している
- 認証なしの外部エンドポイント経由（3.1の問題と関連）
- 10分間隔でキャッシュを全削除するのはキャッシュの意味を弱める

**提案**:
- キャッシュ削除ロジックを直接呼び出す（importして実行）
- キャッシュのTTL管理はキャッシュ層の責務にする

---

### 3.15 [Low] `getEncodedUrl` が毎回配列を再生成

**対象**: `config.ts:611-618`

```typescript
export const getEncodedUrl = (): UrlListItemAndHashEncoded[] => {
  return urlList.map((d) => ({
    ...d,
    hashEncoded: encodeURI(d.hash),
  }))
}
```

**問題**: 呼び出しのたびに新しい配列を生成している。`urlList` は不変なのでメモ化可能。

**提案**: モジュールレベルで一度だけ生成する。

```typescript
export const encodedUrlList: UrlListItemAndHashEncoded[] = urlList.map((d) => ({
  ...d,
  hashEncoded: encodeURI(d.hash),
}))
```

---

### 3.16 [Low] `findPodcastConfig` のバグ

**対象**: `config.ts:620-627`

```typescript
export const findPodcastConfig = (hashEncoded: string) => {
  const urlListItemAndHashEncodedList = getEncodedUrl()
  return urlListItemAndHashEncodedList.find((d) => {
    return hashEncoded === d.hash  // hashEncoded と d.hash を比較
  })
}
```

**問題**: 引数名は `hashEncoded` だが、比較対象は `d.hash`（エンコード前）。`d.hashEncoded` と比較すべきではないか。引数がエンコード済みなら不一致になるケースがある（日本語ハッシュ値の場合）。

**提案**: 引数の意図を明確にし、比較対象を統一する。

---

## 4. アーキテクチャ改善の推奨事項

### 4.1 推奨ディレクトリ構造

```
voicecamp/
├── routes/                  # ルーティングのみ (thin handler)
│   ├── api/
│   └── content/
├── components/              # 変更なし
├── islands/                 # 変更なし
├── domain/
│   ├── podcast/             # ポッドキャスト関連のビジネスロジック
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── episode.ts
│   ├── cache/               # キャッシュ抽象化
│   │   ├── interface.ts
│   │   ├── deno-kv.ts
│   │   └── upstash.ts
│   └── shared/              # 共有ユーティリティ
│       ├── date.ts
│       └── image.ts
├── hooks/                   # hook → hooks (複数形に統一)
├── data/
│   └── podcasts.json        # ポッドキャスト一覧データ
├── config/
│   └── env.ts               # 環境変数管理
└── tests/                   # テストディレクトリ
    ├── unit/
    └── integration/
```

### 4.2 優先度別ロードマップ

| 優先度 | 対応内容 | 効果 |
|--------|----------|------|
| 1 | 500秒sleepの削除 (3.2) | サービス障害の防止 |
| 2 | キャッシュ削除APIの認証追加 (3.1) | セキュリティリスク排除 |
| 3 | エラーハンドリング追加 (3.5) | サービス安定性向上 |
| 4 | originハードコードの環境変数化 (3.6) | 運用性向上 |
| 5 | キャッシュ層統一 (3.3) | 保守性向上 |
| 6 | config.tsの外部データ化 (3.4) | 拡張性向上 |
| 7 | 未使用コード削除 (3.10) | コード品質向上 |
| 8 | テスト追加 (3.8) | 回帰防止 |

---

## 5. まとめ

VoiceCampはDeno + Freshを活用した軽量なSSR+Islands構成のポッドキャストアプリとして、全体的にシンプルなアーキテクチャになっている。ただし、プロダクションとして運用するにあたり、以下の3点が最も重要な課題である。

1. **セキュリティ**: 認証なしのキャッシュ削除APIは即座に対処が必要
2. **信頼性**: 500秒sleepの残存、エラーハンドリングの不備はサービス障害に直結する
3. **保守性**: キャッシュ二重実装、ハードコード設定、テスト不在は長期的な技術的負債になる

これらの改善を段階的に進めることで、より堅牢で保守しやすいコードベースになる。
