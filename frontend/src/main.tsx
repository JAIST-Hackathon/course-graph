import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@styles/global.css";

/**
 * アプリケーションのエントリーポイント
 * React 18のcreateRootを使用してアプリケーションをマウント
 */

// ルート要素を取得（index.html の <div id="root"></div>）
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// React 18の新しいルートAPIを使用してアプリケーションをレンダリング
// StrictModeで開発中の潜在的な問題を検出
ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
