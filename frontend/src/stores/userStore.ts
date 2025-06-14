import {
	type User,
	fetchUsers as fetchUsersFromApi,
} from "@services/userService";
import { create } from "zustand";

/**
 * ユーザー情報の状態管理インターフェース
 */
interface UserState {
	users: User[]; // ユーザーリスト
	loading: boolean; // ローディング状態
	error: Error | null; // エラー情報
	fetchUsers: () => Promise<void>; // ユーザー情報取得関数
}

/**
 * Zustandを使用したユーザー状態管理ストア
 * グローバルなユーザー情報の状態を管理
 */
export const useUserStore = create<UserState>((set) => ({
	// 初期状態
	users: [],
	loading: false,
	error: null,

	// ユーザー一覧を取得するアクション
	fetchUsers: async () => {
		// ローディング開始
		set({ loading: true, error: null });
		try {
			// APIからユーザー情報を取得
			const users = await fetchUsersFromApi();
			// 成功時：ユーザー情報を更新
			set({ users, loading: false });
		} catch (e) {
			// エラー処理：unknown型をError型に変換
			const error = e instanceof Error ? e : new Error(String(e));
			set({ error, loading: false });
		}
	},
}));
