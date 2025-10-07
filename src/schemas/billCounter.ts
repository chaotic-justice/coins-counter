import { z } from "zod";

export const billCounterSchema = z.object({
	"5": z.number().int().min(0, "Must be a positive number"),
	"10": z.number().int().min(0, "Must be a positive number"),
	"20": z.number().int().min(0, "Must be a positive number"),
	"50": z.number().int().min(0, "Must be a positive number"),
	"100": z.number().int().min(0, "Must be a positive number"),
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
