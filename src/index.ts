/* MIT license */
import * as colorNames from 'color-name';
import * as swizzle from 'simple-swizzle';

const reverseNames: Record<string, string> = {};

// create a list of reverse color names
for (const name in colorNames) {
	if (colorNames.hasOwnProperty(name)) {
		const nameRGB = colorNames[name].join(',');
		reverseNames[nameRGB] = name;
	}
}

export type ColorModel = 'rgb' | 'hsl' | 'hwb' | 'hex' | 'keyword';
export type ColorValue = [number, number, number, number?];
export interface Color {
	model: ColorModel;
	value: ColorValue
};

const parseGeneric = (colorStr: string): Color | null => {
	const prefix = colorStr.substring(0, 3).toLowerCase();
	const hashPrefix = colorStr.substring(0, 1);

	if (hashPrefix === '#') {
		const val = parseHex(colorStr);

		if (val !== null) {
			return { model: 'hex', value: val };
		}

	}

	let val: ColorValue | null;
	let model: ColorModel;
	switch (prefix) {
		case 'hsl':
			val = parseHsl(colorStr);
			model = 'hsl';
			break;
		case 'hwb':
			val = parseHwb(colorStr);
			model = 'hwb';
			break;
		default:
			val = parseRgb(colorStr);
			model = 'rgb';
			break;
	}

	if (!val) {
		val = parseKeyword(colorStr);
		model = 'keyword';
	}

	if (!val) {

		return null;
	}

	return { model: model, value: val };
};

const parseRgb = (colorStr: string): ColorValue | null => {
	if (!colorStr) {
		return null;
	}

	const rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	const per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;

	let rgb: ColorValue = [0, 0, 0, 1];
	let match;

	if (match = colorStr.match(rgba)) {
		for (let i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = colorStr.match(per)) {
		for (let i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else {
		return null;
	}

	for (let i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i] as number, 0, 255);
	}
	rgb[3] = clamp(rgb[3] as number, 0, 1);

	return rgb;
};

const parseHex = (colorStr: string): ColorValue | null => {
	const abbr = /^#([a-f0-9]{3,4})$/i;
	const hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;

	let rgb: ColorValue = [0, 0, 0, 1];
	let match;
	let hexAlpha;

	if (match = colorStr.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (let i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			const i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = Math.round((parseInt(hexAlpha, 16) / 255) * 100) / 100;
		}
	} else if (match = colorStr.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (let i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100;
		}
	} else {
		return null;
	}

	for (let i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i] as number, 0, 255);
	}
	rgb[3] = clamp(rgb[3] as number, 0, 1);

	return rgb;
}

const parseKeyword = (colorStr: string): ColorValue | null => {
	const keyword = /(\D+)/;

	let rgb = [0, 0, 0];
	let match;

	if (match = colorStr.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		rgb = (colorNames as any)[match[1]];

		if (!rgb) {
			return null;
		}

		return [rgb[0], rgb[1], rgb[2], 1];
	}

	return null;
}

const parseHsl = (colorStr: string): ColorValue | null => {
	if (!colorStr) {
		return null;
	}

	const hsl = /^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	const match = colorStr.match(hsl);

	if (match) {
		const alpha = parseFloat(match[4]);
		const h = (parseFloat(match[1]) + 360) % 360;
		const s = clamp(parseFloat(match[2]), 0, 100);
		const l = clamp(parseFloat(match[3]), 0, 100);
		const a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

const parseHwb = (colorStr: string): ColorValue | null => {
	if (!colorStr) {
		return null;
	}

	const hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	const match = colorStr.match(hwb);

	if (match) {
		const alpha = parseFloat(match[4]);
		const h = ((parseFloat(match[1]) % 360) + 360) % 360;
		const w = clamp(parseFloat(match[2]), 0, 100);
		const b = clamp(parseFloat(match[3]), 0, 100);
		const a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

const formatHex = (...args: any): string => {
	const rgba = swizzle(args);

	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

const formatRgb = (...args: any): string => {
	const rgba = swizzle(args);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

const formatRgbPercent = (...args: any): string => {
	const rgba = swizzle(args);

	const r = Math.round(rgba[0] / 255 * 100);
	const g = Math.round(rgba[1] / 255 * 100);
	const b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

const formatHsl = (...args: any): string => {
	const hsla = swizzle(args);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
const formatHwb = (...args: any): string => {
	const hwba = swizzle(args);

	let a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

const formatKeyword = (rgb: ColorValue): string => {
	const nameRGB = rgb.slice(0, 3).join(',');
	return reverseNames[nameRGB];
};

// helpers
const clamp = (num: number, min: number, max: number): number => {
	return Math.min(Math.max(min, num), max);
}

const hexDouble = (num: number): string => {
	const str = num.toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}

const parse = {
	get: parseGeneric,
	rgb: parseRgb,
	hsl: parseHsl,
	hwb: parseHwb,
	keyword: parseKeyword,
	hex: parseHex,
}

const format = {
	hex: formatHex,
	rgb: formatRgb,
	rgbPercent: formatRgbPercent,
	hsl: formatHsl,
	hwb: formatHwb,
	keyword: formatKeyword,
};

export default {
	format,
	parse
};
