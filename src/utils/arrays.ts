/**
 * Array sorting function for numbers, in ascending order
 */
const numericSort = (a: number, b: number): number => a - b;

/**
 * Array sorting function for numbers, in descending order
 */
const numericSortDescending = (a: number, b: number): number => b - a;

export { numericSort, numericSortDescending };
