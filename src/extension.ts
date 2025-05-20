import * as vscode from "vscode";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { exec } from "child_process";
import * as constants from "./constants";
import { promisify } from "util";

export const execAsync = promisify(exec);

export function getExtensionConfig() {
  const config = vscode.workspace.getConfiguration(constants.CONFIG_SECTION);
  const apiKey = config.get<string>(constants.CONFIG_API_KEY);
  const customInstruction = config.get<string>(constants.CONFIG_CUSTOM_INSTRUCTION);
  return { apiKey, customInstruction };
}

export async function getStagedDiff(workspaceFolderUri: vscode.Uri): Promise<string> {
  const { stdout } = await execAsync("git diff --staged", {
    cwd: workspaceFolderUri.fsPath,
  });
  return stdout.trim();
}

export async function generateCommitMessageFromApi(
  apiKey: string,
  customInstruction: string | undefined,
  diff: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: constants.GEMINI_MODEL });

  let prompt = `${constants.PROMPT_BASE}${diff}${constants.PROMPT_SUFFIX}`;
  if (customInstruction) {
    prompt += `${constants.PROMPT_CUSTOM_INSTRUCTION_PREFIX}${customInstruction}`;
  }

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text || constants.ERROR_GENERATING_COMMIT_MESSAGE;
}

// Exported for testing
export async function handleGenerateCommitMessageCommand() {
  // 設定を取得
  const { apiKey, customInstruction } = getExtensionConfig();

  if (!apiKey) {
    vscode.window.showErrorMessage(constants.ERROR_NO_API_KEY);
    return;
  }

  // アクティブなエディタを取得
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage(constants.ERROR_NO_ACTIVE_EDITOR);
    return;
  }

  try {
    const uri = vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri;
    if (!uri) {
      vscode.window.showErrorMessage(constants.ERROR_NO_WORKSPACE_FOLDER);
      return;
    }
    // ステージングされた差分を取得
    const gitDiff = await getStagedDiff(uri);

    if (!gitDiff) {
      vscode.window.showErrorMessage(constants.ERROR_NO_GIT_CHANGES);
      return;
    }

    // Gemini APIを初期化 & メッセージ生成
    const commitMessage = await generateCommitMessageFromApi(
      apiKey,
      customInstruction,
      gitDiff
    );

    // 生成されたメッセージを表示
    vscode.window.showInformationMessage(
      `${constants.INFO_GENERATED_COMMIT_MESSAGE}${commitMessage}`
    );
    const terminal = vscode.window.activeTerminal;
    if (terminal) {
      const escapedCommitMessage = commitMessage.trim().replace(/'/g, "'\"'\"'");
      terminal.sendText(`git commit -m '${escapedCommitMessage}'`, false);
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(
      `${constants.ERROR_GENERATING_COMMIT_MESSAGE_DETAIL} ${errorMessage}`
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    constants.COMMAND_ID,
    handleGenerateCommitMessageCommand
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
