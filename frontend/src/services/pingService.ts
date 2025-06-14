import api from "./api";

export const ping = async (): Promise<string> => {
	const { data } = await api.get<string>("/ping");
	return data;
};
