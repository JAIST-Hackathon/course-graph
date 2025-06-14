import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	server: {
		// 開発時のAPIプロキシ設定：フロントエンドからのAPI呼び出しをバックエンドに転送
		// 「/api/…」のリクエストを http://localhost:8080/api/… に転送
		proxy: {
			"/api": {
				target: "http://localhost:8080",
				changeOrigin: true,
			},
		},
	},
});
