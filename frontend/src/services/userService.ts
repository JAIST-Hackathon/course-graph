import api from "./api";

/**
 * ユーザー情報の型定義
 */
export type User = {
	id: string;
	name: string;
};

/**
 * ユーザー一覧を取得するAPI関数
 * @returns ユーザー情報の配列を返すPromise
 */
export const fetchUsers = async (): Promise<User[]> => {
	const { data } = await api.get<User[]>("/users");
	return data;
};
