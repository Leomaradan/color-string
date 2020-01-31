"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colorNames = require("color-name");
var swizzle = require("simple-swizzle");
var reverseNames = {};
for (var name in colorNames) {
    if (colorNames.hasOwnProperty(name)) {
        var nameRGB = colorNames[name].join(',');
        reverseNames[nameRGB] = name;
    }
}
;
var parseGeneric = function (colorStr) {
    var prefix = colorStr.substring(0, 3).toLowerCase();
    var hashPrefix = colorStr.substring(0, 1);
    if (hashPrefix === '#') {
        var val_1 = parseHex(colorStr);
        if (val_1 !== null) {
            return { model: 'hex', value: val_1 };
        }
    }
    var val;
    var model;
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
var parseRgb = function (colorStr) {
    if (!colorStr) {
        return null;
    }
    var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    var rgb = [0, 0, 0, 1];
    var match;
    if (match = colorStr.match(rgba)) {
        for (var i = 0; i < 3; i++) {
            rgb[i] = parseInt(match[i + 1], 0);
        }
        if (match[4]) {
            rgb[3] = parseFloat(match[4]);
        }
    }
    else if (match = colorStr.match(per)) {
        for (var i = 0; i < 3; i++) {
            rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
        }
        if (match[4]) {
            rgb[3] = parseFloat(match[4]);
        }
    }
    else {
        return null;
    }
    for (var i = 0; i < 3; i++) {
        rgb[i] = clamp(rgb[i], 0, 255);
    }
    rgb[3] = clamp(rgb[3], 0, 1);
    return rgb;
};
var parseHex = function (colorStr) {
    var abbr = /^#([a-f0-9]{3,4})$/i;
    var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
    var rgb = [0, 0, 0, 1];
    var match;
    var hexAlpha;
    if (match = colorStr.match(hex)) {
        hexAlpha = match[2];
        match = match[1];
        for (var i = 0; i < 3; i++) {
            var i2 = i * 2;
            rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
        }
        if (hexAlpha) {
            rgb[3] = Math.round((parseInt(hexAlpha, 16) / 255) * 100) / 100;
        }
    }
    else if (match = colorStr.match(abbr)) {
        match = match[1];
        hexAlpha = match[3];
        for (var i = 0; i < 3; i++) {
            rgb[i] = parseInt(match[i] + match[i], 16);
        }
        if (hexAlpha) {
            rgb[3] = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100;
        }
    }
    else {
        return null;
    }
    for (var i = 0; i < 3; i++) {
        rgb[i] = clamp(rgb[i], 0, 255);
    }
    rgb[3] = clamp(rgb[3], 0, 1);
    return rgb;
};
var parseKeyword = function (colorStr) {
    var keyword = /(\D+)/;
    var rgb = [0, 0, 0];
    var match;
    if (match = colorStr.match(keyword)) {
        if (match[1] === 'transparent') {
            return [0, 0, 0, 0];
        }
        rgb = colorNames[match[1]];
        if (!rgb) {
            return null;
        }
        return [rgb[0], rgb[1], rgb[2], 1];
    }
    return null;
};
var parseHsl = function (colorStr) {
    if (!colorStr) {
        return null;
    }
    var hsl = /^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    var match = colorStr.match(hsl);
    if (match) {
        var alpha = parseFloat(match[4]);
        var h = (parseFloat(match[1]) + 360) % 360;
        var s = clamp(parseFloat(match[2]), 0, 100);
        var l = clamp(parseFloat(match[3]), 0, 100);
        var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, s, l, a];
    }
    return null;
};
var parseHwb = function (colorStr) {
    if (!colorStr) {
        return null;
    }
    var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    var match = colorStr.match(hwb);
    if (match) {
        var alpha = parseFloat(match[4]);
        var h = ((parseFloat(match[1]) % 360) + 360) % 360;
        var w = clamp(parseFloat(match[2]), 0, 100);
        var b = clamp(parseFloat(match[3]), 0, 100);
        var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, w, b, a];
    }
    return null;
};
var formatHex = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var rgba = swizzle(args);
    return ('#' +
        hexDouble(rgba[0]) +
        hexDouble(rgba[1]) +
        hexDouble(rgba[2]) +
        (rgba[3] < 1
            ? (hexDouble(Math.round(rgba[3] * 255)))
            : ''));
};
var formatRgb = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var rgba = swizzle(args);
    return rgba.length < 4 || rgba[3] === 1
        ? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
        : 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};
var formatRgbPercent = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var rgba = swizzle(args);
    var r = Math.round(rgba[0] / 255 * 100);
    var g = Math.round(rgba[1] / 255 * 100);
    var b = Math.round(rgba[2] / 255 * 100);
    return rgba.length < 4 || rgba[3] === 1
        ? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
        : 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};
var formatHsl = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var hsla = swizzle(args);
    return hsla.length < 4 || hsla[3] === 1
        ? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
        : 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};
var formatHwb = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var hwba = swizzle(args);
    var a = '';
    if (hwba.length >= 4 && hwba[3] !== 1) {
        a = ', ' + hwba[3];
    }
    return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};
var formatKeyword = function (rgb) {
    var nameRGB = rgb.slice(0, 3).join(',');
    return reverseNames[nameRGB];
};
var clamp = function (num, min, max) {
    return Math.min(Math.max(min, num), max);
};
var hexDouble = function (num) {
    var str = num.toString(16).toUpperCase();
    return (str.length < 2) ? '0' + str : str;
};
var parse = {
    get: parseGeneric,
    rgb: parseRgb,
    hsl: parseHsl,
    hwb: parseHwb,
    keyword: parseKeyword,
    hex: parseHex,
};
var format = {
    hex: formatHex,
    rgb: formatRgb,
    rgbPercent: formatRgbPercent,
    hsl: formatHsl,
    hwb: formatHwb,
    keyword: formatKeyword,
};
exports.default = {
    format: format,
    parse: parse
};
