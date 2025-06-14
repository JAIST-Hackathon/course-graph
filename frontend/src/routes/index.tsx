import Layout from "@components/Layout";
import HomePage from "@pages/HomePage";
import PingPage from "@pages/PingPage";
import UsersPage from "@pages/UsersPage";
import { Route, Routes } from "react-router-dom";

/**
 * アプリケーションのルーティング設定
 * すべてのルートとページコンポーネントのマッピングを管理
 */
export default function AppRoutes() {
	return (
		<Routes>
			{/*
			 * Layout コンポーネントでラップすることで、
			 * すべてのページに共通のヘッダーやナビゲーションを適用
			 */}
			<Route element={<Layout />}>
				{/* ホームページ（ルートパス） */}
				<Route index element={<HomePage />} />
				{/* ユーザー一覧ページ */}
				<Route path="users" element={<UsersPage />} />
				{/* APIヘルスチェックページ */}
				<Route path="ping" element={<PingPage />} />
				{/* 404エラー時はホームページにリダイレクト */}
				<Route path="*" element={<HomePage />} />
			</Route>
		</Routes>
	);
}
