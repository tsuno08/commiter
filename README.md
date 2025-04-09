# Commiter - AI コミットメッセージ生成拡張機能

Gemini API を使用して、ステージングされた差分から適切なコミットメッセージを自動生成する VS Code 拡張機能です。

## 特徴

- ステージング差分からコミットメッセージを自動生成
- Gemini API との連携
- ターミナルコンテキストメニューから直接実行可能

## インストール

1. VS Code の拡張機能マーケットプレースから"Commiter"をインストール
2. 拡張機能の設定で Gemini API キーを設定

## 使い方

1. ターミナルパネルで右クリック → "Generate Commit Message"を選択
2. またはコマンドパレット(`Cmd+Shift+P`)で`Commiter: Generate Commit Message`を実行
3. 生成されたメッセージを確認してコミット

## 設定

| 設定項目                     | 説明                                 | デフォルト値 |
| ---------------------------- | ------------------------------------ | ------------ |
| `commiter.geminiApiKey`      | Gemini API キー                      | ""           |
| `commiter.customInstruction` | コミットメッセージ生成用カスタム指示 | ""           |

## 開発者向け

```bash
# 依存関係のインストール
yarn install

# 開発ビルド
yarn compile

# パッケージング
yarn vsce:package

# デバッグ実行
F5 (VS Codeのデバッグモード)
```

## リンク

- リポジトリ: [https://github.com/tsuno08/commiter](https://github.com/tsuno08/commiter)
- バージョン: 0.0.1
