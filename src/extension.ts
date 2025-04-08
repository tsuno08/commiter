import * as vscode from "vscode";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "commiter.generateCommitMessage",
    async () => {
      // APIキーを設定から取得
      const apiKey = vscode.workspace
        .getConfiguration("commiter")
        .get("geminiApiKey") as string;
      if (!apiKey) {
        vscode.window.showErrorMessage(
          "Gemini APIキーが設定されていません。設定から入力してください。"
        );
        return;
      }

      const customInstruction = vscode.workspace
        .getConfiguration("commiter")
        .get("customInstruction") as string;

      // アクティブなエディタを取得
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("アクティブなエディタがありません");
        return;
      }

      try {
        const uri = vscode.workspace.getWorkspaceFolder(
          editor.document.uri
        )?.uri;
        if (!uri) {
          vscode.window.showErrorMessage(
            "ワークスペースフォルダが見つかりません"
          );
          return;
        }
        // ステージングされた差分を取得
        const { stdout: gitDiff } = await execAsync("git diff --staged", {
          cwd: uri.fsPath,
        });

        if (!gitDiff) {
          vscode.window.showErrorMessage(
            "ステージングされた変更が見つかりませんでした"
          );
          return;
        }

        // Gemini APIを初期化
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // プロンプトを作成
        let prompt = `以下のコード変更に対する適切なコミットメッセージを生成してください:\n\n${gitDiff}\n\n返答は必ずコミットメッセージだけにしてください。`;
        if (customInstruction) {
          prompt += `\n\n追加の指示: ${customInstruction}`;
        }

        // メッセージ生成
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const commitMessage =
          text || "コミットメッセージを生成できませんでした";

        // 生成されたメッセージを表示
        vscode.window.showInformationMessage(
          `生成されたコミットメッセージ: ${commitMessage}`
        );
        vscode.window.terminals.forEach((terminal) => {
          console.log(
            `Terminal name: ${terminal.name}, Terminal process ID: ${terminal.processId}`
          );
          if (terminal) {
            terminal.show();
            terminal.sendText(`git commit -m '${commitMessage.trim()}'`, false);
          }
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(
          `コミットメッセージの生成に失敗しました: ${errorMessage}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
