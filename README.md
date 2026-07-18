# flow-sample

TypeScript ユーザー向けに、[Flow](https://flow.org/) を使って Todo アプリを実装しながら型システムと周辺ツールを学ぶためのサンプルです。

## アプリ機能

- Todo の追加 / 完了トグル / 個別削除 / 全削除
- インライン編集（Enter 保存 / Esc 取消）
- `localStorage` への永続化（JSON の parse は `Result` 型で失敗を表現）

## セットアップ

```bash
pnpm install
pnpm dev          # dist を watch + live-server (port 3000)
pnpm check        # flow check
pnpm lint
pnpm build        # dist/
pnpm build:docs   # docs/（GitHub Pages 用。通常は CD が担当）
```

Node バージョンは `.nvmrc` を参照してください。

エディタでは Flow Language Support を入れ、ワークスペースの `.vscode/settings.json` で `javascript.validate.enable: false` にしています（TS 言語サービスと Flow 記法の競合回避）。

## 技術スタック

| 役割          | 採用                                              |
| ------------- | ------------------------------------------------- |
| 型チェック    | Flow (`flow-bin`) + `/* @flow */`                 |
| 型の strip    | Babel (`@babel/preset-flow`) + Hermes parser      |
| バンドル      | esbuild（`uuid` など）                            |
| CSS           | Tailwind CSS v4 + PostCSS                         |
| Lint / Format | ESLint (hermes-eslint) + Prettier (hermes plugin) |
| Hooks         | lefthook（pre-commit で check / lint / format）   |
| libdef        | flow-typed（`uuid`。`postinstall` で取得）        |

ビルドの流れ: **Flow で型チェック → Babel で型を剥がす → esbuild でバンドル**。  
Flow は TypeScript のような「別言語」ではなく、**JavaScript に静的型チェックを足すツール**です。実行には strip / バンドルが別途必要です。

## このリポジトリで学んだこと

### 1. Flow の立ち位置

- 主目的は静的型チェック（TS のような言語拡張ではない）
- React コアなど Meta 系コードを読む入口にもなる
- 現代 Flow は記法が TypeScript に寄っている（`keyof` / `Omit` / `Partial` / `unknown` / `readonly` など）
- 一方で旧来の `$Keys` / `$Diff` / `mixed` / `+T` などは非推奨・削除が進んでいる

### 2. Flow らしい型

| 概念                    | このリポでの例                                | メモ                                                                                                          |
| ----------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **opaque type**         | `TodoId`                                      | subtype opaque（`opaque type TodoId: string = string`）。外から見ると string の一種だが、生 string は代入不可 |
| **Maybe (`?T`)**        | `findTodo(): ?Todo`                           | `T \| null \| void`。オプショナルチェイン `?.` とは別（実行時演算子 vs 型）                                   |
| **optional property**   | `draft?: string`                              | キー側の `?`。値側の `?T` と意味が違う                                                                        |
| **discriminated union** | `EditState`, `Result`                         | `type` / `ok` で narrowing                                                                                    |
| **generics**            | `Result<T, E>`, `ok` / `err`                  | 呼び出し側は推論されることが多い                                                                              |
| **type guards**         | `value is T` / `implies value is T`           | 旧 `%checks` の後継。実行時は boolean、型だけ絞り込みに効く                                                   |
| **variance**            | `readonly` プロパティ、`Result<out T, out E>` | 読み取り専用・共変。旧 `+` 記法は非推奨                                                                       |
| **utility types**       | `keyof` / `Omit` / `Partial`                  | 例: `TodoPatch = Partial<Omit<Todo, 'id'>>`                                                                   |
| **exact object**        | `{ foo: string }`                             | 現代 Flow では exact が基本。余分なキーを許す inexact は `{ foo: string, ... }`                               |

関連ファイル:

- `src/js/types.js` — `Todo` / `TodoId` / `EditState` / parse
- `src/js/result.js` — `Result`
- `src/js/guards.js` — type guards
- `src/js/storage.js` — `unknown` JSON → `Result<Array<Todo>>`

### 3. 境界での型（localStorage）

文字列 ↔ 構造化データの境目は失敗が普通に起きるので、`boolean` ではなく `Result` で表現した。

```text
localStorage の string
  → JSON.parse（失敗しうる）
  → unknown
  → parseTodos（形・型を検証）
  → Result<Array<Todo>, string>
```

opaque の `TodoId` は、定義ファイル内でのみ生 string から作れる。

### 4. ツールチェーンでハマったこと

- **VS Code / Cursor**: 組み込み JS/TS 検証が Flow の `type` エイリアスに偽エラーを出す → ワークスペースで JS validate を切る
- **補完**: Flow は型エラーは出せても、TS ほどリテラル候補が出ないことが多い
- **Babel**: デフォルトパーサは `value is T` / `out` / `readonly` を解けない → `babel-plugin-syntax-hermes-parser` が必要
- **Prettier**: 同様に hermes プラグインが必要（バージョンも揃える）

### 5. TypeScript ユーザーとしての所感

向いていること:

- opaque / Maybe / exact など、理論寄りの型の考え方を体験する
- React 内部コードを読む準備

向かない・まだ弱いこと:

- エディタの IntelliSense 体験
- エコシステム・ドキュメントの厚み（アプリ開発の第一選択としては TS の方が無難）

## さらに読むとよいもの

- [React のコード読んでたら Flow にボコられてん…](https://zenn.dev/nyaomaru/articles/learn-flow-to-read-react) — `mixed` / `empty` / opaque / exact
- [TypeScript と Flow の variance](https://zenn.dev/nyaomaru/articles/typescript-flow-variance)
- [Flow 公式ドキュメント](https://flow.org/en/docs/)
- [Modernizing Legacy Flow Syntax](https://flow.org/en/docs/modernizing-legacy-syntax/)

このリポではまだ深く触れていない代表例: **inexact object**、完全不透明 opaque。

### 6. 型パズル（任意）

アプリ本体とは別に、[type-challenges](https://github.com/type-challenges/type-challenges) 風のドリルを `type-challenges/` に置いてあります。型だけなのでビルド成果物には出ず、`pnpm check` で検証します。詳細は [type-challenges/README.md](./type-challenges/README.md)。

## ライセンス

ISC
