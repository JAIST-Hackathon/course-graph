import axios from "axios";

/**
 * Axiosインスタンスの設定
 * 環境変数 VITE_API_URL が設定されていればそれを使用
 * 未設定の場合はデフォルトで "/api/v1" を使用
 */
const api = axios.create({
	// 環境変数からAPIのベースURLを取得（.envファイルで設定）
	baseURL: import.meta.env.VITE_API_URL ?? "/api/v1",
	// デフォルトのヘッダー設定
	headers: { "Content-Type": "application/json" },
});

// 必要に応じてリクエスト/レスポンスインターセプターを追加可能
// api.interceptors.request.use(...)
// api.interceptors.response.use(...)

export default api;
