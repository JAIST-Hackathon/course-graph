import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

/**
 * ユーザー一覧ページコンポーネント
 * APIからユーザー情報を取得して一覧表示
 */
export default function UsersPage() {
	// Zustandストアから状態と関数を取得
	const users = useUserStore((s) => s.users);
	const fetchUsers = useUserStore((s) => s.fetchUsers);
	const loading = useUserStore((s) => s.loading);
	const error = useUserStore((s) => s.error);

	// コンポーネントマウント時にユーザー情報を取得
	useEffect(() => {
		fetchUsers().catch(console.error);
	}, [fetchUsers]);

	// ローディング状態の表示
	if (loading) return <p>ロード中...</p>;
	// エラー状態の表示
	if (error) return <p>エラーが発生しました: {error.message}</p>;

	// ユーザー一覧の表示
	return (
		<div>
			<h1 className="text-2xl font-semibold mb-4">ユーザー一覧</h1>
			<ul className="space-y-2">
				{users.map((u) => (
					<li key={u.id} className="p-4 border rounded-md">
						<p className="font-medium">UserName: {u.name}</p>
						<p className="text-sm text-gray-600">ID: {u.id}</p>
					</li>
				))}
			</ul>
		</div>
	);
}
