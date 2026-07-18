# Flow type challenges

[type-challenges](https://github.com/type-challenges/type-challenges) 風の **型だけのドリル**です。アプリのビルド（Babel / esbuild）には入りません。`pnpm check`（`flow check`）でのみ検証されます。

## 使い方

1. 各 `000x-*.js` の解答型（`MyPick` など）をいじる
2. `pnpm check` — 期待と違えば `Expect<...>` が赤くなる
3. わざと壊すなら、コメントアウトされている代入を外してみる（opaque など）

## ファイル

| ファイル                             | 内容                                     |
| ------------------------------------ | ---------------------------------------- |
| `utils.js`                           | `Expect` / `Equal` / `NotEqual`          |
| `0001-my-pick.js`                    | Easy — `Pick` 相当                       |
| `0002-my-readonly.js`                | Easy — `Readonly` 相当                   |
| `0003-my-exclude.js`                 | Easy — `Exclude`（`empty` ≈ TS `never`） |
| `0004-opaque-id.js` + `opaque-id.js` | Flow らしい subtype opaque               |

最初は解答入りです。自分で解くときは該当の `type MyXxx = ...` を消してから書いてみてください。
