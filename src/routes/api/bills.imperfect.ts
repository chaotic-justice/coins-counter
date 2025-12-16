import { api } from "@/lib/fetch";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/bills/imperfect")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const data = await request.json();
				try {
          // @ts-expect-error
					const response = await api.billsImperfect(data);
					return new Response(JSON.stringify(response), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					return new Response(
						JSON.stringify({ error: "Failed to fetch" + error }),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
