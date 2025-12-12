interface BillCount {
	five: number;
	ten: number;
	twenty: number;
	fifty: number;
	hundred: number;
}

export interface DistributionResult {
	isDivisibleByThree: boolean;
	canBeEvenlyDistributed: boolean;
	totalAmount: number;
	totalBills: number;
	distribution?: {
		stack1: BillCount;
		stack2: BillCount;
		stack3: BillCount;
	};
	reason?: string;
}

/**
 * Helper function to count bills in a stack
 */
export function countBillsInStack(stack: number[]): BillCount {
	return {
		five: stack.filter((denom) => denom === 5).length,
		ten: stack.filter((denom) => denom === 10).length,
		twenty: stack.filter((denom) => denom === 20).length,
		fifty: stack.filter((denom) => denom === 50).length,
		hundred: stack.filter((denom) => denom === 100).length,
	};
}

/**
 * Alternative: DP-based solution for more complex cases
 * This handles edge cases better than greedy algorithm
 */
export function canDistributeBillsEvenlyDP(
	bills: BillCount,
): DistributionResult {
	const { five, ten, twenty, fifty, hundred } = bills;

	// Calculate total amount
	const totalAmount =
		five * 5 + ten * 10 + twenty * 20 + fifty * 50 + hundred * 100;

	// Check divisibility
	if (totalAmount % 3 !== 0) {
		return {
			isDivisibleByThree: false,
			canBeEvenlyDistributed: false,
			totalAmount,
			totalBills: five + ten + twenty + fifty + hundred,
			reason: `Total amount $${totalAmount} is not divisible by 3`,
		};
	}

	const target = totalAmount / 3;

	// Create list of all bills
	const allBills: number[] = [];
	allBills.push(...Array(five).fill(5));
	allBills.push(...Array(ten).fill(10));
	allBills.push(...Array(twenty).fill(20));
	allBills.push(...Array(fifty).fill(50));
	allBills.push(...Array(hundred).fill(100));

	// Sort in descending order for better performance
	allBills.sort((a, b) => b - a);

	// DP approach: find 3 subsets that sum to target
	const used = new Array(allBills.length).fill(false);

	// Try to find 3 subsets
	for (let i = 0; i < 3; i++) {
		// Find subset that sums to target
		const subset = findSubsetSum(allBills, used, target);
		if (!subset) {
			return {
				isDivisibleByThree: true,
				canBeEvenlyDistributed: false,
				totalAmount,
				totalBills: allBills.length,
				reason: `Cannot find stack ${i + 1} with value $${target}`,
			};
		}

		// Mark bills as used
		subset.forEach((index) => {
			used[index] = true;
		});
	}

	return {
		isDivisibleByThree: true,
		canBeEvenlyDistributed: true,
		totalAmount,
		totalBills: allBills.length,
	};
}

/**
 * Helper for DP solution: find subset that sums to target
 */
function findSubsetSum(
	bills: number[],
	used: boolean[],
	target: number,
): number[] | null {
	const n = bills.length;
	const memo: Map<string, boolean> = new Map();

	function dfs(
		index: number,
		currentSum: number,
		path: number[],
	): number[] | null {
		if (currentSum === target) return [...path];
		if (currentSum > target || index >= n) return null;
		if (used[index]) return dfs(index + 1, currentSum, path);

		const key = `${index}-${currentSum}`;
		if (memo.has(key)) return null;

		// Option 1: Take current bill
		path.push(index);
		const withCurrent = dfs(index + 1, currentSum + bills[index], path);
		if (withCurrent) return withCurrent;
		path.pop();

		// Option 2: Skip current bill
		const withoutCurrent = dfs(index + 1, currentSum, path);
		if (withoutCurrent) return withoutCurrent;

		memo.set(key, false);
		return null;
	}

	return dfs(0, 0, []);
}
