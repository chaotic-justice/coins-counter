import type { Combo } from "@/types/api";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type Props = {
	combos: Combo[];
	selectedComboIdx: number;
	setSelectedComboIdx: (val: number) => void;
};

export default function SubtractionMultipleChoice({
	combos,
	selectedComboIdx,
	setSelectedComboIdx,
}: Props) {
	return (
		<form>
			<RadioGroup
				onValueChange={(v) => setSelectedComboIdx(parseInt(v))}
				defaultValue={selectedComboIdx.toString()}
			>
				{combos.map((combo, idx) => {
					return (
						<div className="flex items-center gap-3">
							<RadioGroupItem
								value={idx.toString()}
								id={combo.amountSubtracted.toLocaleString()}
							/>
							<Label htmlFor={`r${idx + 1}`}>{combo.description}</Label>
						</div>
					);
				})}
			</RadioGroup>
		</form>
	);
}
