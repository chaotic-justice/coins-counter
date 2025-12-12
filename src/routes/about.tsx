import BentoComboPicker from "@/components/coins/bento-combo-picker";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: About,
});

function About() {
	return (
		<div className="container p-4 py-8 mx-auto">
			<div>
				<BentoComboPicker />
			</div>
		</div>
	);
}