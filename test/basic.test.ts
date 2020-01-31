import colorString from '../src';

describe('Parse tests', () => {

	it('should parse specific getters correctly', () => {
		expect(colorString.parse.hex('#fef')).toEqual([255, 238, 255, 1]);
		expect(colorString.parse.hex('#fffFEF')).toEqual([255, 255, 239, 1]);
		expect(colorString.parse.rgb('rgb(244, 233, 100)')).toEqual([244, 233, 100, 1]);
		expect(colorString.parse.rgb('rgb(100%, 30%, 90%)')).toEqual([255, 77, 229, 1]);
		expect(colorString.parse.keyword('transparent')).toEqual([0, 0, 0, 0]);
		expect(colorString.parse.hsl('hsl(240, 100%, 50.5%)')).toEqual([240, 100, 50.5, 1]);
		expect(colorString.parse.hsl('hsl(240deg, 100%, 50.5%)')).toEqual([240, 100, 50.5, 1]);
		expect(colorString.parse.hwb('hwb(240, 100%, 50.5%)')).toEqual([240, 100, 50.5, 1]);
		expect(colorString.parse.hwb('hwb(240deg, 100%, 50.5%)')).toEqual([240, 100, 50.5, 1]);
	});

	it('should parse generic getters correctly', () => {
		expect(colorString.parse.get('#fef')).toEqual({ model: 'hex', value: [255, 238, 255, 1] });
		expect(colorString.parse.get('#fffFEF')).toEqual({ model: 'hex', value: [255, 255, 239, 1] });
		expect(colorString.parse.get('#fffFEFff')).toEqual({ model: 'hex', value: [255, 255, 239, 1] });
		expect(colorString.parse.get('#fffFEF00')).toEqual({ model: 'hex', value: [255, 255, 239, 0] });
		expect(colorString.parse.get('#fffFEFa9')).toEqual({ model: 'hex', value: [255, 255, 239, 0.66] });
		expect(colorString.parse.get('rgb(244, 233, 100)')).toEqual({ model: 'rgb', value: [244, 233, 100, 1] });
		expect(colorString.parse.get('rgb(100%, 30%, 90%)')).toEqual({ model: 'rgb', value: [255, 77, 229, 1] });
		expect(colorString.parse.get('transparent')).toEqual({ model: 'keyword', value: [0, 0, 0, 0] });
		expect(colorString.parse.get('hsl(240, 100%, 50.5%)')).toEqual({ model: 'hsl', value: [240, 100, 50.5, 1] });
		expect(colorString.parse.get('hsl(240deg, 100%, 50.5%)')).toEqual({ model: 'hsl', value: [240, 100, 50.5, 1] });
		expect(colorString.parse.get('hwb(240, 100%, 50.5%)')).toEqual({ model: 'hwb', value: [240, 100, 50.5, 1] });
		expect(colorString.parse.get('hwb(240deg, 100%, 50.5%)')).toEqual({ model: 'hwb', value: [240, 100, 50.5, 1] });
	});

	it('should parse invalid generic getters correctly', () => {
		expect(colorString.parse.get('hsla(250, 100%, 50%, 50%)')).toEqual(null);
		expect(colorString.parse.get('rgba(250, 100%, 50%, 50%)')).toEqual(null);
		expect(colorString.parse.get('333333')).toEqual(null);
		expect(colorString.parse.get('#1')).toEqual(null);
		expect(colorString.parse.get('#f')).toEqual(null);
		expect(colorString.parse.get('#4f')).toEqual(null);
		expect(colorString.parse.get('#45ab4')).toEqual(null);
		expect(colorString.parse.get('#45ab45e')).toEqual(null);

	});

	it('should parse invalid specific getters with signs correctly', () => {
		expect(colorString.parse.rgb('rgb(-244, +233, -100)')).toEqual([0, 233, 0, 1]);
		expect(colorString.parse.hsl('hsl(+240, 100%, 50.5%)')).toEqual([240, 100, 50.5, 1]);
		expect(colorString.parse.rgb('rgba(200, +20, -233, -0.0)')).toEqual([200, 20, 0, 0]);
		expect(colorString.parse.rgb('rgba(200, +20, -233, -0.0)')).toEqual([200, 20, 0, 0]);
		expect(colorString.parse.hsl('hsla(+200, 100%, 50%, -0.2)')).toEqual([200, 100, 50, 0]);
		expect(colorString.parse.hsl('hsla(-10.0, 100%, 50%, -0.2)')).toEqual([350, 100, 50, 0]);
		expect(colorString.parse.hsl('hsla(.5, 100%, 50%, -0.2)')).toEqual([0.5, 100, 50, 0]);
		expect(colorString.parse.hwb('hwb(+240, 100%, 50.5%)')).toEqual([240, 100, 50.5, 1]);
		expect(colorString.parse.hwb('hwb(-240deg, 100%, 50.5%)')).toEqual([120, 100, 50.5, 1]);
		expect(colorString.parse.hwb('hwb(-240deg, 100%, 50.5%, +0.6)')).toEqual([120, 100, 50.5, 0.6]);
		expect(colorString.parse.hwb('hwb(10.0deg, 100%, 50.5%)')).toEqual([10, 100, 50.5, 1]);
		expect(colorString.parse.hwb('hwb(-.5, 100%, 50.5%)')).toEqual([359.5, 100, 50.5, 1]);
		expect(colorString.parse.hwb('hwb(-10.0deg, 100%, 50.5%, +0.6)')).toEqual([350, 100, 50.5, 0.6]);

	});

	it('subsequent return values should not change array', () => {
		expect(colorString.parse.keyword('blue')).toEqual([0, 0, 255, 1]);
		expect(colorString.parse.keyword('blue')).toEqual([0, 0, 255, 1]);
	});

	it('should parse alpha correctly', () => {
		expect(colorString.parse.hex('#fffa')).toEqual([255, 255, 255, 0.67]);
		expect(colorString.parse.hex('#c814e933')).toEqual([200, 20, 233, 0.2]);
		expect(colorString.parse.hex('#c814e900')).toEqual([200, 20, 233, 0]);
		expect(colorString.parse.hex('#c814e9ff')).toEqual([200, 20, 233, 1]);
		expect(colorString.parse.rgb('rgba(200, 20, 233, 0.2)')).toEqual([200, 20, 233, 0.2]);
		expect(colorString.parse.rgb('rgba(200, 20, 233, 0)')).toEqual([200, 20, 233, 0]);
		expect(colorString.parse.rgb('rgba(100%, 30%, 90%, 0.2)')).toEqual([255, 77, 229, 0.2]);
		expect(colorString.parse.hsl('hsla(200, 20%, 33%, 0.2)')).toEqual([200, 20, 33, 0.2]);
		expect(colorString.parse.hwb('hwb(200, 20%, 33%, 0.2)')).toEqual([200, 20, 33, 0.2]);
		expect(colorString.parse.hex('#fef')).toEqual([255, 238, 255, 1]);
		expect(colorString.parse.rgb('rgba(200, 20, 233, 0.2)')).toEqual([200, 20, 233, 0.2]);
		expect(colorString.parse.hsl('hsl(240, 100%, 50.5%)')).toEqual([240, 100, 50.5, 1]);
		expect(colorString.parse.rgb('rgba(0,0,0,0)')).toEqual([0, 0, 0, 0]);
		expect(colorString.parse.hsl('hsla(0,0%,0%,0)')).toEqual([0, 0, 0, 0]);
		expect(colorString.parse.hwb('hwb(400, 10%, 200%, 0)')).toEqual([40, 10, 100, 0]);

	});

	it('should parse out-of-range values', () => {
		expect(colorString.parse.rgb('rgba(300, 600, 100, 3)')).toEqual([255, 255, 100, 1]);
		expect(colorString.parse.rgb('rgba(8000%, 100%, 333%, 88)')).toEqual([255, 255, 255, 1]);
		expect(colorString.parse.hsl('hsla(400, 10%, 200%, 10)')).toEqual([40, 10, 100, 1]);
		expect(colorString.parse.hwb('hwb(400, 10%, 200%, 10)')).toEqual([40, 10, 100, 1]);

	});

	it('should parse invalid values correctly', () => {
		expect(colorString.parse.keyword('yellowblue')).toEqual(null);
		expect(colorString.parse.rgb('hsl(100, 10%, 10%)')).toEqual(null);
		expect(colorString.parse.rgb('hwb(100, 10%, 10%)')).toEqual(null);
		expect(colorString.parse.rgb('rgb(123, 255, 9)1234')).toEqual(null);
		expect(colorString.parse.hex('333333')).toEqual(null);
		expect(colorString.parse.rgb('1')).toEqual(null);
		expect(colorString.parse.rgb('1892371923879')).toEqual(null);
		expect(colorString.parse.rgb('444')).toEqual(null);
		expect(colorString.parse.hex('#1')).toEqual(null);
		expect(colorString.parse.hex('#f')).toEqual(null);
		expect(colorString.parse.hex('#4f')).toEqual(null);
		expect(colorString.parse.hex('#45ab4')).toEqual(null);
		expect(colorString.parse.hex('#45ab45e')).toEqual(null);
		expect(colorString.parse.hsl('hsl(41, 50%, 45%)1234')).toEqual(null);
		expect(colorString.parse.hwb('hwb(240, 100%, 50.5%)1234')).toEqual(null);
	});
});

describe('Format tests', () => {
	it('should format to hex', () => {
		expect(colorString.format.hex([255, 10, 35])).toEqual('#FF0A23');
		expect(colorString.format.hex([255, 10, 35, 1])).toEqual('#FF0A23');
		expect(colorString.format.hex([255, 10, 35], 1)).toEqual('#FF0A23');
		expect(colorString.format.hex([255, 10, 35, 0.3])).toEqual('#FF0A234D');
		expect(colorString.format.hex([255, 10, 35], 0.3)).toEqual('#FF0A234D');
		expect(colorString.format.hex([255, 10, 35, 0])).toEqual('#FF0A2300');
		expect(colorString.format.hex([255, 10, 35], 0)).toEqual('#FF0A2300');
	});

	it('should format to rgb', () => {
		expect(colorString.format.rgb([255, 10, 35])).toEqual('rgb(255, 10, 35)');
		expect(colorString.format.rgb([255, 10, 35, 0.3])).toEqual('rgba(255, 10, 35, 0.3)');
		expect(colorString.format.rgb([255, 10, 35], 0.3)).toEqual('rgba(255, 10, 35, 0.3)');
		expect(colorString.format.rgb([255, 10, 35, 0.3])).toEqual('rgba(255, 10, 35, 0.3)');
		expect(colorString.format.rgb([255, 10, 35], 0.3)).toEqual('rgba(255, 10, 35, 0.3)');
		expect(colorString.format.rgb([255, 10, 35])).toEqual('rgb(255, 10, 35)');
		expect(colorString.format.rgb([255, 10, 35, 0])).toEqual('rgba(255, 10, 35, 0)');
	});

	it('should format to rgb percent', () => {
		expect(colorString.format.rgbPercent([255, 10, 35])).toEqual('rgb(100%, 4%, 14%)');

		expect(colorString.format.rgbPercent([255, 10, 35, 0.3])).toEqual('rgba(100%, 4%, 14%, 0.3)');
		expect(colorString.format.rgbPercent([255, 10, 35], 0.3)).toEqual('rgba(100%, 4%, 14%, 0.3)');
		expect(colorString.format.rgbPercent([255, 10, 35, 0.3])).toEqual('rgba(100%, 4%, 14%, 0.3)');
		expect(colorString.format.rgbPercent([255, 10, 35], 0.3)).toEqual('rgba(100%, 4%, 14%, 0.3)');
		expect(colorString.format.rgbPercent([255, 10, 35])).toEqual('rgb(100%, 4%, 14%)');
	});

	it('should format to hsl', () => {
		expect(colorString.format.hsl([280, 40, 60])).toEqual('hsl(280, 40%, 60%)');
		expect(colorString.format.hsl([280, 40, 60, 0.3])).toEqual('hsla(280, 40%, 60%, 0.3)');
		expect(colorString.format.hsl([280, 40, 60], 0.3)).toEqual('hsla(280, 40%, 60%, 0.3)');
		expect(colorString.format.hsl([280, 40, 60, 0.3])).toEqual('hsla(280, 40%, 60%, 0.3)');
		expect(colorString.format.hsl([280, 40, 60], 0.3)).toEqual('hsla(280, 40%, 60%, 0.3)');
		expect(colorString.format.hsl([280, 40, 60], 0)).toEqual('hsla(280, 40%, 60%, 0)');
		expect(colorString.format.hsl([280, 40, 60])).toEqual('hsl(280, 40%, 60%)');
	});

	it('should format to hwb', () => {
		expect(colorString.format.hwb([280, 40, 60])).toEqual('hwb(280, 40%, 60%)');
		expect(colorString.format.hwb([280, 40, 60, 0.3])).toEqual('hwb(280, 40%, 60%, 0.3)');
		expect(colorString.format.hwb([280, 40, 60], 0.3)).toEqual('hwb(280, 40%, 60%, 0.3)');
		expect(colorString.format.hwb([280, 40, 60], 0)).toEqual('hwb(280, 40%, 60%, 0)');
	});

	it('should format to keyword', () => {
		expect(colorString.format.keyword([255, 255, 0])).toEqual('yellow');
		expect(colorString.format.keyword([100, 255, 0])).toBeUndefined();
	});
});
