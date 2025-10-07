const BASE_URL = import.meta.env.VITE_COMPUTING_API_URL;

if (!BASE_URL) {
	throw new Error("VITE_BACKEND_URL is not defined");
}

export const coinsService = {
	async post<T>(endpoint: string, data: any): Promise<T> {
		const response = await fetch(`${BASE_URL}${endpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	},
};
