import { ping } from "@services/pingService";
import { create } from "zustand";

interface PingState {
	message: string;
	loading: boolean;
	error: Error | null;
	loadPing: () => Promise<void>;
}

export const usePingStore = create<PingState>((set) => ({
	message: "",
	loading: false,
	error: null,
	loadPing: async () => {
		set({ loading: true, error: null });
		try {
			const msg = await ping();
			set({ message: msg, loading: false });
		} catch (e) {
			// `e` はデフォルトで `unknown`。Error でなければ文字列化してラップ
			const error = e instanceof Error ? e : new Error(String(e));
			set({ error, loading: false });
		}
	},
}));
