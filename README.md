# color-string

[![Build Status](https://travis-ci.org/Qix-/color-string.svg?branch=master)](https://travis-ci.org/Qix-/color-string)

> library for parsing and generating CSS color strings.

## Install

With [npm](http://npmjs.org/):

```console
$ npm install color-string
```

## Usage

### Parsing

```js
colorString.parse.get('#FFF')                          // {model: 'rgb', value: [255, 255, 255, 1]}
colorString.parse.get('#FFFA')                         // {model: 'rgb', value: [255, 255, 255, 0.67]}
colorString.parse.get('#FFFFFFAA')                     // {model: 'rgb', value: [255, 255, 255, 0.67]}
colorString.parse.get('hsl(360, 100%, 50%)')           // {model: 'hsl', value: [0, 100, 50, 1]}
colorString.parse.get('hwb(60, 3%, 60%)')              // {model: 'hwb', value: [60, 3, 60, 1]}

colorString.parse.get.rgb('#FFF')                      // [255, 255, 255, 1]
colorString.parse.get.rgb('blue')                      // [0, 0, 255, 1]
colorString.parse.get.rgb('rgba(200, 60, 60, 0.3)')    // [200, 60, 60, 0.3]
colorString.parse.get.rgb('rgb(200, 200, 200)')        // [200, 200, 200, 1]

colorString.parse.get.hsl('hsl(360, 100%, 50%)')       // [0, 100, 50, 1]
colorString.parse.get.hsl('hsla(360, 60%, 50%, 0.4)')  // [0, 60, 50, 0.4]

colorString.parse.get.hwb('hwb(60, 3%, 60%)')          // [60, 3, 60, 1]
colorString.parse.get.hwb('hwb(60, 3%, 60%, 0.6)')     // [60, 3, 60, 0.6]

colorString.parse.get.rgb('invalid color string')      // null
```

### Generation

```js
colorString.format.hex([255, 255, 255])     // "#FFFFFF"
colorString.format.hex([0, 0, 255, 0.4])    // "#0000FF66"
colorString.format.hex([0, 0, 255], 0.4)    // "#0000FF66"
colorString.format.rgb([255, 255, 255])     // "rgb(255, 255, 255)"
colorString.format.rgb([0, 0, 255, 0.4])    // "rgba(0, 0, 255, 0.4)"
colorString.format.rgb([0, 0, 255], 0.4)    // "rgba(0, 0, 255, 0.4)"
colorString.format.rgb.percent([0, 0, 255]) // "rgb(0%, 0%, 100%)"
colorString.format.keyword([255, 255, 0])   // "yellow"
colorString.format.hsl([360, 100, 100])     // "hsl(360, 100%, 100%)"
colorString.format.hwb([50, 3, 15])         // "hwb(50, 3%, 15%)"

// all functions also support swizzling
colorString.format.rgb(0, [0, 255], 0.4)    // "rgba(0, 0, 255, 0.4)"
colorString.format.rgb([0, 0], [255], 0.4)  // "rgba(0, 0, 255, 0.4)"
colorString.format.rgb([0], 0, [255, 0.4])  // "rgba(0, 0, 255, 0.4)"
```
