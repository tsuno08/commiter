# Commiter - AI コミットメッセージ生成拡張機能

Gemini API を使用して、コード変更から適切なコミットメッセージを自動生成する VS Code 拡張機能です。

## 特徴

- 差分からコミットメッセージを自動生成
- Gemini API とのシームレスな連携

## インストール

1. VS Code の拡張機能マーケットプレースから"Commiter"をインストール
2. 拡張機能の設定で Gemini API キーを設定

## 使い方

1. コード変更を選択
2. コマンドパレット(`Cmd+Shift+P`)で`Commiter: Generate Commit Message`を実行
3. 生成されたメッセージを確認してコミット

## 設定

| 設定項目                | 説明             | デフォルト値 |
| ----------------------- | ---------------- | ------------ |
| `commiter.geminiApiKey` | Gemini API キー  | ""           |
| `commiter.model`        | 使用するモデル名 | "gemini-pro" |

## 開発者向け

```bash
# 依存関係のインストール
yarn install

# ビルド
yarn build

# デバッグ実行
F5 (VS Codeのデバッグモード)
```
