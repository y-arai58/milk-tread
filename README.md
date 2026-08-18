# milk-tread

保護猫の里親マッチングを行う **保護猫管理システム** のフロントエンドです。
管理者は保護猫の登録と里親申請の審査を、一般ユーザーは猫の閲覧と里親申請を行えます。

React 19 + TypeScript（Create React App）で構築されており、本番では WordPress REST API
(`/wp-json/cat-shelter/v1/...`) をバックエンドとして動作します。開発時は API を呼ばず、
localStorage 上のモックデータで完結します。

## 主な機能

### 共通

- ログイン / ログアウト（ログイン状態は localStorage に永続化）
- ロール（`administrator` / それ以外）に応じたダッシュボードの出し分け

### 管理者ダッシュボード

- 保護猫の新規登録（名前・年齢・品種・説明・健康状態・画像アップロード）
- 保護猫一覧の閲覧（ステータス・健康状態つき）
- 里親申請の一覧表示（申請日の新しい順）
- 申請の承認 / 却下。承認するとその猫のステータスが自動で `adopted` になる

### ユーザーダッシュボード

- 里親募集中（`available`）の猫一覧
- モーダルからメッセージを添えて里親申請を送信
- 自分の申請状況（審査中 / 承認済み / 却下）の確認

## 動作環境

- Node.js 18 以上を推奨
- npm

## セットアップ

```bash
npm install
npm start
```

`http://localhost:3000` で開発サーバーが起動します。

## デモ用アカウント

開発モードではパスワードは検証されません。ユーザー名だけでロールが決まります。

| ユーザー名 | パスワード | ロール |
| --- | --- | --- |
| `admin` | 任意（例: `password`） | 管理者 |
| `user` | 任意（例: `password`） | 一般ユーザー |

上記以外のユーザー名を入力するとログインに失敗します。

## npm スクリプト

| コマンド | 説明 |
| --- | --- |
| `npm start` | 開発サーバーを起動する |
| `npm run build` | `build/` へ本番ビルドを出力する |
| `npm test` | テストをウォッチモードで実行する |
| `npm run eject` | CRA の設定を展開する（不可逆） |

## ディレクトリ構成

```
src/
├── index.tsx                 エントリポイント
├── index.css
├── types/
│   └── type.ts               Cat / Application / User の型定義
├── services/
│   ├── api.ts                APIクライアント（モックと実APIを切り替え）
│   ├── storage.ts            localStorage の読み書き
│   └── mockData.ts           開発用の初期データ
├── utils/
│   └── formatter.ts          ステータスの日本語表示変換
└── components/
    └── Dashboard/
        ├── Dashboard.tsx     認証状態とロールによる振り分け
        ├── Login/            ログインフォーム
        ├── Admin/            管理者ダッシュボード
        ├── User/             ユーザーダッシュボード
        └── Common/           カード・モーダルの共通スタイル
```

## データフローとモックAPI

`src/services/api.ts` は `process.env.NODE_ENV === 'development'` のときモックモードで動作します。

- **モックモード**: `mockData.ts` の初期データを localStorage に投入し、以降の読み書きはすべて
  localStorage 経由で行います。実際の通信は発生せず、代わりに 500ms の遅延をシミュレートします。
  データを初期状態に戻したいときは、ブラウザの localStorage から `cat_shelter_` で始まるキーを削除してください。
- **本番モード**: 同じインターフェースで WordPress REST API を呼び出します。更新系リクエストには
  `window.wpApiSettings.nonce` を `X-WP-Nonce` ヘッダーとして付与します。

使用する localStorage のキーは以下の3つです。

- `cat_shelter_current_user`
- `cat_shelter_cats`
- `cat_shelter_applications`

## バックエンドAPI

本番モードで参照するエンドポイントは次のとおりです。

| メソッド | パス | 用途 |
| --- | --- | --- |
| `POST` | `/wp-json/cat-shelter/v1/login` | ログイン |
| `POST` | `/wp-json/cat-shelter/v1/logout` | ログアウト |
| `GET` | `/wp-json/cat-shelter/v1/cats` | 保護猫一覧（`?status=` で絞り込み） |
| `POST` | `/wp-json/cat-shelter/v1/cats` | 保護猫の追加（`multipart/form-data`） |
| `GET` | `/wp-json/cat-shelter/v1/applications` | 申請一覧（`?user_id=` で絞り込み） |
| `POST` | `/wp-json/cat-shelter/v1/applications` | 申請の送信 |
| `PUT` | `/wp-json/cat-shelter/v1/applications/{id}` | 申請ステータスの更新 |
| `GET` | `/wp-json/wp/v2/users/me` | ログイン中のユーザー情報 |

## ステータス値

| 対象 | 値 | 表示 |
| --- | --- | --- |
| 猫 | `available` | 里親募集中 |
| 猫 | `adopted` | 譲渡済み |
| 申請 | `pending` | 審査中 |
| 申請 | `approved` | 承認済み |
| 申請 | `rejected` | 却下 |
