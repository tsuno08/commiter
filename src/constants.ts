export const COMMAND_ID = "commiter.generateCommitMessage";
export const CONFIG_SECTION = "commiter";
export const CONFIG_API_KEY = "geminiApiKey";
export const CONFIG_CUSTOM_INSTRUCTION = "customInstruction";
export const GEMINI_MODEL = "gemini-2.0-flash";

// Error messages
export const ERROR_NO_API_KEY = "Gemini APIキーが設定されていません。設定から入力してください。";
export const ERROR_NO_ACTIVE_EDITOR = "アクティブなエディタがありません";
export const ERROR_NO_WORKSPACE_FOLDER = "ワークスペースフォルダが見つかりません";
export const ERROR_NO_GIT_CHANGES = "ステージングされた変更が見つかりませんでした"; // This was "No Git changes found to commit." - changed to match the Japanese text
export const ERROR_GIT_DIFF = "Error getting Git diff:"; // This is not used in the Japanese version, I'll keep it for now
export const ERROR_GENERATING_COMMIT_MESSAGE = "コミットメッセージを生成できませんでした"; // This was "Error generating commit message:" - changed to match the Japanese text
export const ERROR_GENERATING_COMMIT_MESSAGE_DETAIL = "コミットメッセージの生成に失敗しました:"; // For the `catch` block

// Prompts and messages
export const PROMPT_BASE = "以下のコード変更に対する適切なコミットメッセージを生成してください:\n\n";
export const PROMPT_SUFFIX = "\n\n返答は必ずコミットメッセージだけにしてください。"; // Added to separate the core instruction
export const PROMPT_CUSTOM_INSTRUCTION_PREFIX = "\n\n追加の指示: ";
export const INFO_GENERATED_COMMIT_MESSAGE = "生成されたコミットメッセージ: ";
