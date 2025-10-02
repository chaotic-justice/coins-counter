import { z } from "zod";

export const billCounterSchema = z.object({
	fives: z.number().int().min(0, "Must be a positive number"),
	tens: z.number().int().min(0, "Must be a positive number"),
	twenties: z.number().int().min(0, "Must be a positive number"),
	fifties: z.number().int().min(0, "Must be a positive number"),
	hundreds: z.number().int().min(0, "Must be a positive number"),
});

export type BillCounterFormData = z.infer<typeof billCounterSchema>;

export interface BillCounterResult {
	total: number;
	breakdown: {
		denomination: number;
		count: number;
		subtotal: number;
	}[];
}
