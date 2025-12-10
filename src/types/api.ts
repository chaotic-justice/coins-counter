interface Bills {
	[key: number]: number;
}

export interface StackStats {
	index: number;
	value: number;
	billCount: number;
	distribution: Bills;
}
