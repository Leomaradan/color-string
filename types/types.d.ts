declare module 'simple-swizzle' {
	export default function swizzleCall(...args: any): any[];
	export function wrap(fn: (...args: any) => any): any[];
}

declare module 'color-name' {
	export type RGB = [number, number, number];
	const colors: Record<string, RGB>;

	export default colors;
}
