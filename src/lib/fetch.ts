import type { BillCounterFormData } from "@/schemas/billCounter";
import type { StackStats, SubtractionStackStats } from "@/types/api";

const BASE_URL = import.meta.env.VITE_COMPUTING_API_URL;

// Generic fetch wrapper with proper error handling
async function apiClient<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const response = await fetch(`${BASE_URL}${endpoint}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			// Add auth headers if needed
			// 'Authorization': `Bearer ${token}`,
			...options.headers,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			message: `HTTP error! status: ${response.status}`,
		}));
		throw new Error(error.message || "Request failed");
	}

	// Handle empty responses (204 No Content)
	if (response.status === 204) {
		return {} as T;
	}

	return response.json() as Promise<T>;
}

// Specific API methods
export const api = {
	billsPerfect: (data: BillCounterFormData) =>
		apiClient<StackStats[]>("/bills/perfect", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	billsImperfect: (data: BillCounterFormData) =>
		apiClient<SubtractionStackStats[]>("/bills/imperfect", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	// // POST create user
	// createUser: (user: CreateUserDto) =>
	// 	apiClient<User>("/users", {
	// 		method: "POST",
	// 		body: JSON.stringify(user),
	// 	}),
	// // PUT update user
	// updateUser: (id: number, user: Partial<User>) =>
	// 	apiClient<User>(`/users/${id}`, {
	// 		method: "PUT",
	// 		body: JSON.stringify(user),
	// 	}),
};
