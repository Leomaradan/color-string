export declare type ColorModel = 'rgb' | 'hsl' | 'hwb' | 'hex' | 'keyword';
export declare type ColorValue = [number, number, number, number?];
export interface Color {
    model: ColorModel;
    value: ColorValue;
}
declare const _default: {
    format: {
        hex: (...args: any) => string;
        rgb: (...args: any) => string;
        rgbPercent: (...args: any) => string;
        hsl: (...args: any) => string;
        hwb: (...args: any) => string;
        keyword: (rgb: ColorValue) => string;
    };
    parse: {
        get: (colorStr: string) => Color | null;
        rgb: (colorStr: string) => ColorValue | null;
        hsl: (colorStr: string) => ColorValue | null;
        hwb: (colorStr: string) => ColorValue | null;
        keyword: (colorStr: string) => ColorValue | null;
        hex: (colorStr: string) => ColorValue | null;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map