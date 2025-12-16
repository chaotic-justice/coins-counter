import BillCounterForm from "@/components/coins/form";
import BillCounterResults from "@/components/coins/result";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
	canDistributeBillsEvenlyDP,
	type DistributionResult,
} from "@/lib/algo";
import { useBillCounter } from "@/lib/useBillCounter";
import { deepEqual } from "@/lib/utils";
import type { StackStats, SubtractionStackStats } from "@/types/api";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslations } from "gt-react";
import { Calculator, RotateCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";

const BillCounter: React.FC = () => {
	const d = useTranslations();
	const [loading, setLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [selectedComboIdx, setSelectedComboIdx] = useState<number>(-1);

	const { form, calculateTotal, resetForm } = useBillCounter();
	const [results, setResults] = useState<ReturnType<
		typeof calculateTotal
	> | null>(null);
	const [stackStats, setStackStats] = useState<StackStats[] | null>(null);
	const [subtractionCombos, setSubtractionCombos] = useState<
		SubtractionStackStats[] | null
	>(null);
	const [billsMath, setBillsMath] = useState<DistributionResult | null>(null);

	// Get form values and watch for changes
	type FormValues = Parameters<typeof calculateTotal>[0];
	const formValues = form.watch() as FormValues;
	const isDirty = form.formState.isDirty;

	useEffect(() => {
		if (selectedComboIdx > -1 && subtractionCombos) {
			const stackStats = subtractionCombos[selectedComboIdx].stackStats;
			setStackStats(stackStats);
		} else {
			setStackStats(null);
		}
	}, [selectedComboIdx, subtractionCombos]);

	const onSubmit = async (data: Parameters<typeof calculateTotal>[0]) => {
		if (form.formState.isSubmitting) {
			return;
		}

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
		setBillsMath(evenly);
		if (evenly.isDivisibleByThree && evenly.canBeEvenlyDistributed) {
			try {
				const perfectRes = await fetch("/api/bills/perfect", {
					method: "POST",
					body: JSON.stringify(data),
				});
				const res = await perfectRes.json();
				// @ts-expect-error
				setStackStats(res);
			} finally {
				setLoading(false);
			}
		} else {
			try {
				const imperfectRes = await fetch("api/bills/imperfect", {
					method: "POST",
					body: JSON.stringify(data),
				});
				const res = await imperfectRes.json();
				// @ts-expect-error
				setSubtractionCombos(res);
			} finally {
				setLoading(false);
			}
			toast.warning(`${d("counter.mathWorkToast")}`);
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
		setSelectedComboIdx(-1);
		resetForm();
		setResults(null);
		const defaultValues = form.formState.defaultValues;
		previousValuesRef.current = defaultValues as FormValues;
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="space-y-2 text-center">
				<div className="flex items-center justify-center gap-2 mb-4">
					<div className="p-2 rounded-lg bg-accent">
						<Calculator className="w-6 h-6 text-accent-foreground" />
					</div>
					<h1 className="text-3xl font-bold text-balance">
						{d("header.appName")}
					</h1>
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				<Card className="shadow-lg">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								{/* <CardTitle className="flex items-center gap-2">
									<Calculator className="w-6 h-6" />
									{d("header.appName")}
								</CardTitle> */}
								<CardDescription>
									{d("counter.form.description")}
								</CardDescription>
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

					<CardContent className="space-y-6">
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
										{loading
											? d("commons.loading")
											: d("counter.form.splitBtn")}
									</Button>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
				<div className="space-y-6">
					{showResults && (
						<BillCounterResults
							results={results}
							stackStats={stackStats}
							billsMath={billsMath}
							subtractionCombos={subtractionCombos}
							selectedComboIdx={selectedComboIdx}
							setSelectedComboIdx={setSelectedComboIdx}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export const Route = createFileRoute("/")({
	component: BillCounter,
});
