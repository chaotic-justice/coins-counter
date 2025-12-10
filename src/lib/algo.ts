interface BillCount {
	five: number;
	ten: number;
	twenty: number;
	fifty: number;
	hundred: number;
}

interface DistributionResult {
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
 * Determines if a stack of bills can be:
 * 1. Divisible by 3 in total amount
 * 2. Evenly distributed into 3 equal-value stacks (not necessarily same bill composition)
 */
export function canDistributeBillsEvenly(bills: BillCount): DistributionResult {
	const { five, ten, twenty, fifty, hundred } = bills;

	// Calculate total amount
	const totalAmount =
		five * 5 + ten * 10 + twenty * 20 + fifty * 50 + hundred * 100;

	// Calculate total number of bills
	const totalBills = five + ten + twenty + fifty + hundred;

	// Check 1: Is total amount divisible by 3?
	const isDivisibleByThree = totalAmount % 3 === 0;

	// If not divisible by 3, we know it can't be distributed evenly
	if (!isDivisibleByThree) {
		return {
			isDivisibleByThree: false,
			canBeEvenlyDistributed: false,
			totalAmount,
			totalBills,
			reason: `Total amount $${totalAmount} is not divisible by 3`,
		};
	}

	// Check 2: Can we create 3 stacks with equal value?
	// Each stack should have target value
	const targetAmountPerStack = totalAmount / 3;

	// Create arrays for easier processing
	const denominations = [100, 50, 20, 10, 5];
	const billCounts = [hundred, fifty, twenty, ten, five];

	// Try to create 3 stacks
	const stacks: number[][] = [[], [], []];
	const remainingCounts = [...billCounts];

	// Greedy algorithm: try to allocate highest denominations first
	for (let stackIndex = 0; stackIndex < 3; stackIndex++) {
		let currentStackAmount = 0;

		// Try to fill this stack to targetAmountPerStack
		for (let i = 0; i < denominations.length; i++) {
			const denom = denominations[i];
			const maxToTake = Math.min(
				remainingCounts[i],
				Math.floor((targetAmountPerStack - currentStackAmount) / denom),
			);

			if (maxToTake > 0) {
				// Allocate these bills to current stack
				stacks[stackIndex].push(...Array(maxToTake).fill(denom));
				remainingCounts[i] -= maxToTake;
				currentStackAmount += maxToTake * denom;
			}

			if (currentStackAmount === targetAmountPerStack) {
				break;
			}
		}

		// If we couldn't fill this stack to target, distribution fails
		if (currentStackAmount !== targetAmountPerStack) {
			return {
				isDivisibleByThree: true,
				canBeEvenlyDistributed: false,
				totalAmount,
				totalBills,
				reason: `Cannot create stack ${stackIndex + 1} with exact value $${targetAmountPerStack}`,
			};
		}
	}

	// Check if all bills were used
	const allBillsUsed = remainingCounts.every((count) => count === 0);

	if (!allBillsUsed) {
		return {
			isDivisibleByThree: true,
			canBeEvenlyDistributed: false,
			totalAmount,
			totalBills,
			reason: "Could not use all bills in the distribution",
		};
	}

	// Convert stacks to BillCount format
	const distribution = {
		stack1: countBillsInStack(stacks[0]),
		stack2: countBillsInStack(stacks[1]),
		stack3: countBillsInStack(stacks[2]),
	};

	return {
		isDivisibleByThree: true,
		canBeEvenlyDistributed: true,
		totalAmount,
		totalBills,
		distribution,
	};
}

/**
 * Helper function to count bills in a stack
 */
function countBillsInStack(stack: number[]): BillCount {
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

// Example usage
const exampleBills: BillCount = {
	five: 2, // $10
	ten: 3, // $30
	twenty: 1, // $20
	fifty: 2, // $100
	hundred: 1, // $100
	// Total: $260, divisible by 3? No (260 % 3 = 2)
};

const exampleBills2: BillCount = {
	five: 3, // $15
	ten: 0, // $0
	twenty: 3, // $60
	fifty: 0, // $0
	hundred: 3, // $300
	// Total: $375, divisible by 3? Yes (375 / 3 = 125)
};

// console.log(canDistributeBillsEvenly(exampleBills));
// console.log(canDistributeBillsEvenly(exampleBills2));
