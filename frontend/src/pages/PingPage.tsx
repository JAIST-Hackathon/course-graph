import { usePingStore } from "@/stores/pingStore";
import { useEffect } from "react";

export default function PingPage() {
	const { message, loading, error, loadPing } = usePingStore();

	useEffect(() => {
		loadPing();
	}, [loadPing]);

	if (loading) return <p>ロード中…</p>;
	if (error) return <p>エラーが発生しました: {error.message}</p>;

	return (
		<div>
			<h1 className="text-2xl font-semibold mb-4">Ping チェック</h1>
			<p>
				サーバーからの応答: <span className="font-mono">{message}</span>
			</p>
		</div>
	);
}
