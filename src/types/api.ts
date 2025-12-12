export interface Bills {
	[key: number]: number;
}

export interface StackStats {
	index: number;
	value: number;
	billCount: number;
	distribution: Bills;
}

export type Combo = {
	newTotal: number;
	amountSubtracted: number;
	combination: Bills | null;
	description: string;
};

