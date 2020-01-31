export declare type ColorModel = 'rgb' | 'hsl' | 'hwb' | 'hex' | 'keyword';
export declare type ColorValue = [number, number, number, number];
export interface Color {
    model: ColorModel;
    value: ColorValue;
}
declare const _default: {
    to: {
        hex: (args_0: number, args_1: number, args_2: number, args_3: number) => string;
        rgb: (args_0: number, args_1: number, args_2: number, args_3: number) => string;
        hsl: (args_0: number, args_1: number, args_2: number, args_3: number) => string;
        hwb: (args_0: number, args_1: number, args_2: number, args_3: number) => string;
        keyword: (rgb: ColorValue) => string;
    };
    get: (colorStr: string) => Color | null;
};
export default _default;
//# sourceMappingURL=index.d.ts.map