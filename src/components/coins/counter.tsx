import { useTranslations } from "gt-react";
import { Calculator, RotateCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import { deepEqual } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
	canDistributeBillsEvenlyDP,
	countBillsInStack,
	type DistributionResult,
} from "@/lib/algo";
import { useBillCounter } from "@/lib/useBillCounter";
import { coinsService } from "@/services/api";
import type { Combo, StackStats } from "@/types/api";
import BillCounterForm from "./form";
import BillCounterResults from "./result";

const BillCounter: React.FC = () => {
	const d = useTranslations();
	const [loading, setLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);

	const { form, calculateTotal, resetForm } = useBillCounter();
	const [results, setResults] = useState<ReturnType<
		typeof calculateTotal
	> | null>(null);

	// Get form values and watch for changes
	type FormValues = Parameters<typeof calculateTotal>[0];
	const formValues = form.watch() as FormValues;
	const isDirty = form.formState.isDirty;

	const [stackStats, setStackStats] = useState<StackStats[] | null>(null);
	const [subtractionCombos, setSubtractionCombos] = useState<Combo[]>([]);
	const [billsMath, setBillsMath] = useState<DistributionResult | null>(null);
	console.log("billsMath", billsMath);
	console.log("results", results);

	const onSubmit = async (data: Parameters<typeof calculateTotal>[0]) => {
		setLoading(true);
		setShowResults(true);
		const input = {
			five: data[5],
			ten: data[10],
			twenty: data[20],
			fifty: data[50],
			hundred: data[100],
		};
		const evenly = canDistributeBillsEvenlyDP(input);
		console.log("evenly", evenly);
		setBillsMath(evenly);
		const calc = calculateTotal(data);
		if (evenly.isDivisibleByThree && evenly.canBeEvenlyDistributed) {
			try {
				const res = await coinsService.post("/bills/perfect", data);
				console.log("res", res);
				setStackStats(res as any);
			} finally {
				setLoading(false);
			}
		} else {
			try {
				const res = await coinsService.post("/bills/imperfect-i", data);
				console.log("res v2:", res);
				setSubtractionCombos(res as any);
			} finally {
				setLoading(false);
			}
			console.log("calc", calc);
			toast.warning("Event start time cannot be earlier than 8am");
		}
	};

	const debouncedSubmit = useDebounceCallback(onSubmit, 500, {
		leading: false, // Don't execute on first click
		trailing: true, // Execute after delay
		maxWait: 1500, // Maximum wait time before execution
	});

	// Use ref to track previous values and avoid unnecessary calculations
	const previousValuesRef = React.useRef<FormValues | null>(null);

	// Auto-calculate when debounced form values change
	useEffect(() => {
		const valuesChanged = !deepEqual(previousValuesRef.current, formValues);

		if (isDirty && valuesChanged) {
			setShowResults(false);
			const calculatedResults = calculateTotal(formValues);
			setResults(calculatedResults);
			previousValuesRef.current = { ...formValues };
		}
	}, [formValues, isDirty, calculateTotal]);

	const handleReset = () => {
		setShowResults(false);
		resetForm();
		setResults(null);
		previousValuesRef.current = {
			100: 0,
			50: 0,
			20: 0,
			10: 0,
			5: 0,
		} as FormValues;
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Calculator className="w-6 h-6" />
							{d("header.appName")}
						</CardTitle>
						<CardDescription>{d("counter.description")}</CardDescription>
					</div>
					<Button
						type="button"
						variant="outline"
						onClick={handleReset}
						className="flex items-center gap-2"
					>
						<RotateCcw className="w-4 h-4" />
						{d("commons.reset")}
					</Button>
				</div>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(debouncedSubmit)}
						className="space-y-6"
					>
						<BillCounterForm form={form} />

						{results && (
							<div className="flex items-center justify-between p-4 border rounded-lg bg-primary/10">
								<span className="text-lg font-semibold">
									{d("counter.form.total")}
								</span>
								<span className="text-2xl font-bold text-primary">
									${results.total.toLocaleString()}
								</span>
							</div>
						)}

						<div className="flex gap-4">
							<Button type="submit" className="flex-1" disabled={loading}>
								{loading ? d("commons.loading") : d("counter.form.splitBtn")}
							</Button>
						</div>
					</form>
				</Form>

				{showResults && (
					<BillCounterResults
						results={results}
						stackStats={stackStats}
						billsMath={billsMath}
						subtractionCombos={subtractionCombos}
					/>
				)}
			</CardContent>
		</Card>
	);
};

export default BillCounter;
