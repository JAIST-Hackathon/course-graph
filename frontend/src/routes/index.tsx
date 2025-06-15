import Layout from "@components/Layout";
import HomePage from "@pages/HomePage";
// import PingPage from "@pages/PingPage";
// import UsersPage from "@pages/UsersPage";
import MemberPage from "@pages/MemberPage";
import SubjectGraphPage from "@/pages/SubjectGraphPage";
import { Route, Routes } from "react-router-dom";

/**
 * アプリケーションのルーティング設定
 * すべてのルートとページコンポーネントのマッピングを管理
 */
export default function AppRoutes() {
	return (
		<Routes>
			{/*
			 *  コンポーネントでラップすることで、
			 * すべてのページに共通のヘッダーやナビゲーションを適用
			 */}
			<Route element={<Layout />}>
				{/* ホームページ（ルートパス） */}
				<Route index element={<HomePage />} />
				{/* ユーザー一覧ページ */}
				{/* <Route path="users" element={<UsersPage />} /> */}
				{/* APIヘルスチェックページ */}
				{/* <Route path="ping" element={<PingPage />} /> */}
				<Route path="member" element={<MemberPage />} />
				{/* 科目の関連図を表示するページ */}
				<Route path="subjectGraph" element={<SubjectGraphPage />} />
				{/* 404エラー時はホームページにリダイレクト */}
				<Route path="*" element={<HomePage />} />
			</Route>
		</Routes>
	);
}
