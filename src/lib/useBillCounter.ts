import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	billCounterSchema,
	type BillCounterFormData,
	type BillCounterResult,
} from "@/schemas/billCounter";

const DENOMINATIONS = [
	{ value: 100, label: "Hundreds", field: "hundreds" as const },
	{ value: 50, label: "Fifties", field: "fifties" as const },
	{ value: 20, label: "Twenties", field: "twenties" as const },
	{ value: 10, label: "Tens", field: "tens" as const },
	{ value: 5, label: "Fives", field: "fives" as const },
];

export const useBillCounter = () => {
	const form = useForm<BillCounterFormData>({
		resolver: zodResolver(billCounterSchema),
		defaultValues: {
			fives: 0,
			tens: 0,
			twenties: 0,
			fifties: 0,
			hundreds: 0,
		},
	});

	const calculateTotal = (data: BillCounterFormData): BillCounterResult => {
		const breakdown = DENOMINATIONS.map((denom) => ({
			denomination: denom.value,
			count: data[denom.field],
			subtotal: data[denom.field] * denom.value,
		}));

		const total = breakdown.reduce((sum, item) => sum + item.subtotal, 0);

		return { total, breakdown };
	};

	const resetForm = () => {
		form.reset({
			fives: 0,
			tens: 0,
			twenties: 0,
			fifties: 0,
			hundreds: 0,
		});
	};

	return {
		form,
		calculateTotal,
		resetForm,
		denominations: DENOMINATIONS,
	};
};
