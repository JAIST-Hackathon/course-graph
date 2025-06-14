import AppRoutes from "@routes/index";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "@styles/global.css";

/**
 * アプリケーションのルートコンポーネント
 * React Routerのルーターを初期化し、アプリケーション全体に提供します
 */

/**
 * ブラウザルーターの設定
 * すべてのルートは AppRoutes コンポーネントで管理されます
 */
const router = createBrowserRouter([
	{
		path: "/*",
		element: <AppRoutes />,
	},
]);

/**
 * App コンポーネント
 * RouterProviderでルーティング機能をアプリケーション全体に提供
 */
export default function App() {
	return <RouterProvider router={router} />;
}
