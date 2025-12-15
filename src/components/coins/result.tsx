import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { DistributionResult } from "@/lib/algo";
import { type BillCounterResult } from "@/schemas/billCounter";
import type { StackStats, SubtractionCombo } from "@/types/api";
import { useTranslations } from "gt-react";
import { DollarSign } from "lucide-react";
import React from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface BillCounterResultsProps {
	results: BillCounterResult | null;
	stackStats: StackStats[] | null;
	billsMath: DistributionResult | null;
	subtractionCombos: SubtractionCombo[] | null;
	selectedComboIdx: number;
	setSelectedComboIdx: (val: number) => void;
}

const BillCounterResults: React.FC<BillCounterResultsProps> = ({
	results,
	stackStats,
	billsMath,
	subtractionCombos,
	selectedComboIdx,
	setSelectedComboIdx,
}) => {
	const d = useTranslations();
	const stacks = 3;
	const comboDescriptions = subtractionCombos?.map((combo) => {
		const parts: string[] = [];
		for (const [bill, qty] of Object.entries(combo.combination!)) {
			parts.push(`${d("counter.form.multiChoiceLabel", { qty, bill })}`);
		}
		const s = `${d("counter.form.removing")} ${parts.join(", ")}.`;
		return s;
	});

	return (
		<Card className="shadow-lg">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<DollarSign className="w-5 h-5" />
					{d("counter.mathWork")}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{billsMath &&
					(!billsMath?.isDivisibleByThree ||
						!billsMath?.canBeEvenlyDistributed) ? (
						<Card className="shadow-md border-warning">
							<CardHeader>
								<CardTitle className="flex items-center justify-between text-lg">
									<span className="text-muted-foreground">
										{d("counter.form.adjustmentRequired")}
									</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<form>
										<RadioGroup
											onValueChange={(v) => setSelectedComboIdx(parseInt(v))}
											defaultValue={selectedComboIdx.toString()}
										>
											{subtractionCombos?.map((combo, idx) => {
												return (
													<div className="flex items-center gap-3">
														<RadioGroupItem
															value={idx.toString()}
															id={combo.amountSubtracted.toLocaleString()}
														/>
														<Label htmlFor={`r${idx + 1}`}>
															{comboDescriptions
																? comboDescriptions[idx]
																: "Empty Label"}
														</Label>
													</div>
												);
											})}
										</RadioGroup>
									</form>
								</div>
							</CardContent>
						</Card>
					) : null}

					{results && results.total > 0 && stacks > 0 && (
						<div className="space-y-4">
							{selectedComboIdx > -1 && (
								<div className="flex items-center gap-2">
									<h6 className="font-semibold">
										{d("counter.form.newTotal", {
											total:
												subtractionCombos && selectedComboIdx > -1
													? subtractionCombos[selectedComboIdx].newTotal
													: -1,
										})}
									</h6>
									<span className="text-sm text-muted-foreground">
										({stacks}{" "}
										{stacks > 1
											? d("counter.stacksLabel")
											: d("counter.stackLabel")}
										)
									</span>
								</div>
							)}

							<div className="grid gap-4 md:grid-cols-2">
								{stackStats &&
									stackStats.map((stack) => (
										<Card key={stack.index} className="shadow-md">
											<CardHeader className="pb-3">
												<CardTitle className="flex items-center justify-between text-lg">
													<span>Stack #{stack.index}</span>
													<span className="text-success">
														${stack.value.toLocaleString()}
													</span>
												</CardTitle>
												<CardDescription>
													{stack.billCount}{" "}
													{stack.billCount === 1 ? "bill" : "bills"} total
												</CardDescription>
											</CardHeader>
											<CardContent className="space-y-2">
												<div className="space-y-1.5 text-sm">
													{stack.distribution[100] > 0 && (
														<div className="flex items-center justify-between">
															<span className="text-muted-foreground">
																$100 bills:
															</span>
															<span className="font-medium">
																{stack.distribution[100]}
															</span>
														</div>
													)}
													{stack.distribution[50] > 0 && (
														<div className="flex items-center justify-between">
															<span className="text-muted-foreground">
																$50 bills:
															</span>
															<span className="font-medium">
																{stack.distribution[50]}
															</span>
														</div>
													)}
													{stack.distribution[20] > 0 && (
														<div className="flex items-center justify-between">
															<span className="text-muted-foreground">
																$20 bills:
															</span>
															<span className="font-medium">
																{stack.distribution[20]}
															</span>
														</div>
													)}
													{stack.distribution[10] > 0 && (
														<div className="flex items-center justify-between">
															<span className="text-muted-foreground">
																$10 bills:
															</span>
															<span className="font-medium">
																{stack.distribution[10]}
															</span>
														</div>
													)}
													{stack.distribution[5] > 0 && (
														<div className="flex items-center justify-between">
															<span className="text-muted-foreground">
																$5 bills:
															</span>
															<span className="font-medium">
																{stack.distribution[5]}
															</span>
														</div>
													)}
													{stack.billCount === 0 && (
														<div className="py-2 text-center text-muted-foreground">
															No bills
														</div>
													)}
												</div>
											</CardContent>
										</Card>
									))}
							</div>

							{/* {remainingAmount > 0 && (
                <Card className="shadow-md border-warning">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Remaining amount after distribution:</span>
                      <span className="text-2xl font-bold text-warning">${remainingAmount.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )} */}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default BillCounterResults;
